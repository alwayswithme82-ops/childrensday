import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { GameHUD } from '../components/game/GameHUD';
import { CubeViewer } from '../components/game/CubeViewer';
import { ProjectionView } from '../components/game/ProjectionView';
import { OptionGrid } from '../components/game/OptionGrid';
import { StoryOverlay } from '../components/game/StoryOverlay';
import { HintModal } from '../components/game/HintModal';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { getLevelByDifficulty } from '../data/levels';
import { useTimer } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import { calcStars } from '../utils/helpers';
import type { Scene } from '../types/game';

type Phase = 'story' | 'playing' | 'result';

const DIRECTION_LABELS = {
  front: '앞에서 본 모습',
  side: '왼쪽에서 본 모습',
  top: '위에서 본 모습',
} as const;

function getQuestionDirection(scene: Scene): string | undefined {
  if (scene.projectionFaces?.length === 1) return DIRECTION_LABELS[scene.projectionFaces[0]];
  if (scene.questionType === 'counting') return '블록 개수';
  if (scene.questionType === 'rotation') return '돌린 뒤 앞에서 본 모습';
  return undefined;
}

function getWrongFeedback(scene: Scene) {
  const face = scene.projectionFaces?.length === 1 ? scene.projectionFaces[0] : undefined;
  if (face === 'front') {
    return '다시 볼까요? 지금 문제는 앞에서 본 모습을 찾는 문제예요. “앞에서 보기” 버튼을 눌러 다시 확인해봐요!';
  }
  if (face === 'top') {
    return '위에서 보면 높이는 잠깐 잊고, 바닥에 놓인 자리를 보면 돼요. “위에서 보기”로 다시 살펴봐요!';
  }
  if (face === 'side') {
    return '이번 문제는 왼쪽에서 본 모습이에요. 앞에서 본 모습과 헷갈리지 않게 “왼쪽에서 보기” 버튼을 눌러봐요!';
  }
  if (scene.questionType === 'counting') {
    return '숨은 큐브까지 하나씩 손가락으로 세어봐요. 앞에 가려진 블록도 있을 수 있어요!';
  }
  return '보는 방향을 다시 맞춰볼까요? 버튼으로 시점을 고정한 뒤 큐브 모양을 천천히 비교해봐요!';
}

function getRewardMessage(index: number, total: number) {
  if (index + 1 >= total) {
    return '보물상자가 열렸어요! 💎\n당신은 큐브 왕국의 창의력 건축가입니다!';
  }
  const rewards = [
    '찰칵! 첫 번째 열쇠 조각을 찾았어요! 🗝️',
    '큐브 문이 열렸어요!\n보물지도 한 조각을 얻었어요. 🗺️',
    '좋아요! 보물상자에 한 걸음 더 가까워졌어요!',
    '반짝! 마법 열쇠가 더 밝게 빛나요. ✨',
  ];
  return rewards[index % rewards.length];
}

export function GamePage() {
  const navigate = useNavigate();
  const {
    difficulty, currentSceneIndex, sceneResults,
    hintsRemaining, nextScene, recordSceneResult, useHint,
  } = useGameStore();
  const { isAuthenticated } = useAuthStore();
  const timer = useTimer();
  const { play } = useSound();

  const [phase, setPhase] = useState<Phase>('story');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsedThisScene, setHintsUsedThisScene] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    if (!difficulty) { navigate('/'); return; }
  }, [isAuthenticated, difficulty, navigate]);

  // 게임 중 새로고침/탭 닫기 시 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Cleanup pending transitions on unmount
  useEffect(() => {
    return () => {
      if (pendingTimeoutRef.current !== null) clearTimeout(pendingTimeoutRef.current);
    };
  }, []);

  // Reset scene-local state when scene changes
  useEffect(() => {
    if (pendingTimeoutRef.current !== null) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }
    setPhase('story');
    setAttempts(0);
    setHintsUsedThisScene(0);
    setSelectedOptionId(null);
    setFeedbackMessage(null);
    timer.pause();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSceneIndex]);

  if (!difficulty) return null;

  const level = getLevelByDifficulty(difficulty);
  const scene = level.scenes[currentSceneIndex];
  if (!scene) return null;

  const totalStars = sceneResults.reduce((s, r) => s + r.stars, 0);
  const correctId = scene.options.find(o => o.correct)?.id ?? '';
  const directionLabel = getQuestionDirection(scene);

  const handleStoryDismiss = () => {
    if (timer.time === 0 && currentSceneIndex === 0) {
      timer.start();
    } else {
      timer.resume();
    }
    timer.markSceneStart();
    setPhase('playing');
  };

  const handleSelect = (optionId: string) => {
    if (phase !== 'playing' || selectedOptionId) return;
    const opt = scene.options.find(o => o.id === optionId);
    if (!opt) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setSelectedOptionId(optionId);
    setPhase('result');

    if (opt.correct) {
      play('correct');
      timer.pause();
      setFeedbackMessage(getRewardMessage(currentSceneIndex, level.scenes.length));
      const stars = calcStars(newAttempts, hintsUsedThisScene);
      const sceneTime = timer.getElapsed();
      const isLast = currentSceneIndex + 1 >= level.scenes.length;
      pendingTimeoutRef.current = setTimeout(() => {
        recordSceneResult({
          sceneId: scene.id,
          correct: true,
          attempts: newAttempts,
          timeSeconds: sceneTime,
          hintsUsed: hintsUsedThisScene,
          stars,
        });
        if (isLast) {
          timer.stop();
          navigate('/result');
        } else {
          nextScene();
        }
      }, 1500);
    } else {
      play('wrong');
      setFeedbackMessage(getWrongFeedback(scene));
      // Allow retry after shake animation
      pendingTimeoutRef.current = setTimeout(() => {
        setSelectedOptionId(null);
        setFeedbackMessage(null);
        setPhase('playing');
      }, 2200);
    }
  };

  const handleHint = () => {
    if (hintsRemaining <= 0) return;
    play('click');
    useHint();
    setHintsUsedThisScene(h => h + 1);
    setShowHint(true);
  };

  return (
    <PageTransition>
      <div className="h-svh min-h-svh flex flex-col overflow-hidden bg-slate-950">
        <GameHUD
          elapsed={timer.time}
          sceneIndex={currentSceneIndex}
          totalScenes={level.scenes.length}
          stars={totalStars}
          hintsRemaining={hintsRemaining}
          onHint={handleHint}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSceneIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 min-h-0 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden overflow-x-hidden"
          >
            {/* 좌측: 3D 큐브 뷰어 */}
            <div className="flex-none md:flex-1 md:w-[60%] flex flex-col p-3 sm:p-4 gap-2 sm:gap-3 min-h-[300px] sm:min-h-[360px] md:min-h-0">
              <div className="flex-1 min-h-[240px] bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden">
                <CubeViewer cubes={scene.cubes} />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 text-center select-none">드래그로 회전해보세요 🔄</p>
            </div>

            {/* 우측: 투영도 + 문제 + 선택지 */}
            <div className="md:w-[40%] p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 overflow-visible md:overflow-y-auto">
              <ProjectionView
                cubes={scene.cubes}
                faces={scene.projectionFaces ?? ['front']}
              />
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gold">보물의 방 {currentSceneIndex + 1}</p>
                <p className="mt-2 text-lg text-white font-medium leading-snug">{scene.questionText}</p>
              </div>
              <AnimatePresence>
                {feedbackMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -6 }}
                    className={[
                      'rounded-2xl border p-4 text-sm font-bold leading-relaxed whitespace-pre-line',
                      selectedOptionId === correctId
                        ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'
                        : 'border-amber-300/40 bg-amber-400/10 text-amber-100',
                    ].join(' ')}
                  >
                    {feedbackMessage}
                  </motion.div>
                )}
              </AnimatePresence>
              <OptionGrid
                options={scene.options}
                onSelect={handleSelect}
                selectedId={selectedOptionId}
                correctId={correctId}
                showResult={phase === 'result' && !!selectedOptionId}
                directionLabel={directionLabel}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <StoryOverlay
          text={scene.storyText}
          characterName={scene.characterName}
          visible={phase === 'story'}
          onDismiss={handleStoryDismiss}
        />

        <HintModal
          open={showHint}
          onClose={() => setShowHint(false)}
          hintText={scene.hintText}
          hintsRemaining={hintsRemaining}
        />
      </div>
    </PageTransition>
  );
}
