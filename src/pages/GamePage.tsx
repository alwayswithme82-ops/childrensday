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

type Phase = 'story' | 'playing' | 'result';

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
    timer.pause();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSceneIndex]);

  if (!difficulty) return null;

  const level = getLevelByDifficulty(difficulty);
  const scene = level.scenes[currentSceneIndex];
  if (!scene) return null;

  const totalStars = sceneResults.reduce((s, r) => s + r.stars, 0);
  const correctId = scene.options.find(o => o.correct)?.id ?? '';

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
      // Allow retry after shake animation
      pendingTimeoutRef.current = setTimeout(() => {
        setSelectedOptionId(null);
        setPhase('playing');
      }, 1000);
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
              <p className="text-lg text-white font-medium leading-snug">{scene.questionText}</p>
              <OptionGrid
                options={scene.options}
                onSelect={handleSelect}
                selectedId={selectedOptionId}
                correctId={correctId}
                showResult={phase === 'result' && !!selectedOptionId}
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
