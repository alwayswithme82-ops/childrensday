import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { GameHUD } from '../components/game/GameHUD';
import { CubeBuilder } from '../components/game/CubeBuilder';
import { CubeViewer } from '../components/game/CubeViewer';
import { MissionRuleCard } from '../components/game/MissionRuleCard';
import { StoryOverlay } from '../components/game/StoryOverlay';
import { HintModal } from '../components/game/HintModal';
import { Modal } from '../components/shared/Modal';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { getBuildLevelByDifficulty, getHintStages } from '../data/buildLevels';
import { useTimer } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import { calcStars } from '../utils/helpers';
import { calculateColorProjection, evaluateRule, validateBuildMission } from '../utils/buildValidation';
import { normalizeProjectionTo3x3 } from '../utils/projectionGrid';
import type { CubeData } from '../types/game';

type Phase = 'story' | 'playing' | 'result' | 'reveal';

const KING_CORRECT = [
  '딱 그 모양이야! 다음으로 가볼까?',
  '와, 정말 잘했어! 보물상자가 한 층 더 가까워졌어.',
  '큐브왕의 후계자가 될 자격이 있군!',
];

const KING_WRONG = [
  '음… 그림을 다시 한번 볼까?',
  '아쉬워. 색깔과 자리를 살짝만 바꿔봐.',
  '거의 다 왔어. 빠진 칸이 없는지 확인해봐.',
];


const REVEAL_SCENES = [
  {
    icon: '🗝️',
    text:
      '세 개의 큐브 열쇠가\n공중에 떠오르더니 빙글빙글 돌아\n하나의 황금 열쇠로 합쳐졌어요.',
    button: '보물상자 열기 🗝️',
  },
  {
    icon: '📦',
    text:
      '철컥!\n보물상자가 활짝 열렸어요.\n안에는 큐브왕이 남긴\n작은 책이 한 권 놓여 있었어요.',
    button: '책 펼쳐 보기 ✨',
  },
  {
    icon: '✉️',
    text:
      '책에는 이렇게 쓰여 있었어요.\n“수학은 비밀을 풀어가는 모험이야.\n너도 이제\n색나무 마을의 건축가다.”',
    button: '건축가 인증서 받기 🎖️',
  },
];

function getRewardMessage(index: number, fallback?: string) {
  const rewards = [
    '철컥!\n무지개 문이 활짝 열렸어요. 🌈',
    '앞에서 본 모습이 완성됐어요!\n숨바꼭질 성공! 🫣',
    '반짝반짝!\n보물탑이 완성되자 보물상자가 열렸어요. 💎',
  ];
  return rewards[Math.min(index, rewards.length - 1)] ?? fallback ?? '잘했어요!';
}

export function GamePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const operatorMode = searchParams.get('admin') === 'true';
  const strictMode = searchParams.get('strict') === 'true';
  const {
    difficulty, currentSceneIndex, sceneResults,
    hintsRemaining, nextScene, recordSceneResult, useHint: consumeHint,
  } = useGameStore();
  const { isAuthenticated } = useAuthStore();
  const timer = useTimer();
  const { play } = useSound();

  const [phase, setPhase] = useState<Phase>('story');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsedThisScene, setHintsUsedThisScene] = useState(0);
  const [builtCubes, setBuiltCubes] = useState<CubeData[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [kingMessage, setKingMessage] = useState<string>('큐브왕의 메모를 따라 재료를 모아봐.');
  const [revealIndex, setRevealIndex] = useState(0);
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    if (!difficulty) { navigate('/'); return; }
  }, [isAuthenticated, difficulty, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    return () => {
      if (pendingTimeoutRef.current !== null) clearTimeout(pendingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (pendingTimeoutRef.current !== null) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }
    setPhase('story');
    setAttempts(0);
    setHintsUsedThisScene(0);
    setBuiltCubes([]);
    setFeedbackMessage(null);
    setKingMessage('큐브왕의 메모를 따라 재료를 모아봐.');
    setShowSolution(false);
    timer.pause();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSceneIndex]);

  const level = difficulty ? getBuildLevelByDifficulty(difficulty) : null;
  const scene = level?.scenes[currentSceneIndex] ?? null;

  // 라이브 규칙 평가 → MissionRuleCard에 표시 (early return 전에 호출되어야 hooks 순서 안정)
  const liveRuleResults = useMemo(
    () => (scene?.rules ?? []).map(r => evaluateRule(builtCubes, r)),
    [builtCubes, scene?.rules],
  );

  if (!difficulty || !level || !scene) return null;

  const totalStars = sceneResults.reduce((s, r) => s + r.stars, 0);
  const successShowing =
    phase === 'result' && feedbackMessage === getRewardMessage(currentSceneIndex, scene.successText);
  const keyPieces = Math.min(sceneResults.length + (successShowing ? 1 : 0), level.scenes.length);

  const handleStoryDismiss = () => {
    if (timer.time === 0 && currentSceneIndex === 0) {
      timer.start();
    } else {
      timer.resume();
    }
    timer.markSceneStart();
    setPhase('playing');
  };

  const handleComplete = () => {
    if (phase !== 'playing') return;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    const validation = validateBuildMission(builtCubes, scene, { strict: strictMode });
    if (import.meta.env.DEV && scene.id === 1) {
      const mission1Validation = validateBuildMission(builtCubes, scene);
      console.log('[Mission 1 Debug] builtCubes', builtCubes);
      console.log(
        '[Mission 1 Debug] actual front',
        normalizeProjectionTo3x3(calculateColorProjection(builtCubes, 'front'), 'front'),
      );
      console.log(
        '[Mission 1 Debug] target front',
        scene.rules?.find(r => r.type === 'targetColorProjection' && r.face === 'front'),
      );
      console.table(mission1Validation.results.map(r => ({
        type: r.rule.type,
        ok: r.ok,
        current: r.current,
        target: r.target,
        label: r.label,
      })));
    }
    if (validation.success) {
      play('correct');
      timer.pause();
      setKingMessage(KING_CORRECT[currentSceneIndex % KING_CORRECT.length]);
      setFeedbackMessage(getRewardMessage(currentSceneIndex, scene.successText));
      setPhase('result');
      const stars = calcStars(newAttempts, hintsUsedThisScene);
      const sceneTime = timer.getElapsed();
      const isLast = currentSceneIndex + 1 >= level.scenes.length;
      // 결과를 즉시 기록 → 건너뛰기로 타임아웃을 취소해도 기록이 남는다
      recordSceneResult({
        sceneId: scene.id,
        correct: true,
        attempts: newAttempts,
        timeSeconds: sceneTime,
        hintsUsed: hintsUsedThisScene,
        stars,
      });
      pendingTimeoutRef.current = setTimeout(() => {
        if (isLast) {
          timer.stop();
          setRevealIndex(0);
          setPhase('reveal');
        } else {
          nextScene();
        }
      }, 1500);
    } else {
      play('wrong');
      setKingMessage(KING_WRONG[newAttempts % KING_WRONG.length]);
      setFeedbackMessage(validation.message);
    }
  };

  const handleRevealNext = () => {
    play('click');
    if (revealIndex + 1 >= REVEAL_SCENES.length) {
      navigate('/result');
      return;
    }
    setRevealIndex(i => i + 1);
  };

  const handleSkip = () => {
    if (!scene || !level) return;
    if (phase === 'reveal') return;

    const isLast = currentSceneIndex + 1 >= level.scenes.length;

    if (pendingTimeoutRef.current !== null) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }

    if (phase === 'result') {
      // 성공 결과는 이미 기록됐으므로 바로 이동
      if (isLast) {
        timer.stop();
        setRevealIndex(0);
        setPhase('reveal');
      } else {
        nextScene();
      }
      return;
    }

    // story / playing: 별 1개로 기록 후 이동
    play('click');
    timer.pause();
    recordSceneResult({
      sceneId: scene.id,
      correct: true,
      attempts: Math.max(1, attempts),
      timeSeconds: timer.getElapsed(),
      hintsUsed: hintsUsedThisScene,
      stars: 1,
    });
    if (isLast) {
      timer.stop();
      setRevealIndex(0);
      setPhase('reveal');
    } else {
      nextScene();
    }
  };

  const handleHint = () => {
    if (hintsRemaining <= 0) return;
    play('click');
    consumeHint();
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
          keyPieces={keyPieces}
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
            <div className="flex-none md:flex-1 md:w-[60%] flex flex-col p-3 sm:p-4 gap-2 sm:gap-3 min-h-[420px] md:min-h-0">
              <CubeBuilder
                cubes={builtCubes}
                onChange={(next) => {
                  setBuiltCubes(next);
                  if (feedbackMessage && phase === 'playing') setFeedbackMessage(null);
                }}
                maxCubes={scene.boardMaxCubes ?? scene.maxCubes ?? 12}
                maxGridSize={scene.maxGridSize}
                requiredColorCount={scene.requiredColorCount}
                disabled={phase !== 'playing'}
                onLimit={() => {
                  setKingMessage('재료가 너무 많아. 메모의 개수를 다시 봐.');
                  setFeedbackMessage('큐브를 너무 많이 쌓았어요!');
                }}
              />
            </div>

            <div className="md:w-[40%] p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 overflow-visible md:overflow-y-auto">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gold">
                  {scene.title ?? `메모 ${currentSceneIndex + 1}`}
                </p>
                <p className="mt-2 text-lg text-white font-medium leading-snug">{scene.questionText}</p>
                <div className="mt-3 rounded-xl bg-slate-950/70 px-3 py-2 text-sm font-bold text-amber-200">
                  👑 큐브왕: “{kingMessage}”
                </div>
              </div>

              <MissionRuleCard
                scene={scene}
                results={liveRuleResults}
                currentCubes={builtCubes.length}
                strictMode={strictMode}
              />

              <AnimatePresence>
                {feedbackMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -6 }}
                    className={[
                      'rounded-2xl border p-4 text-sm font-bold leading-relaxed whitespace-pre-line',
                      successShowing
                        ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'
                        : 'border-amber-300/40 bg-amber-400/10 text-amber-100',
                    ].join(' ')}
                  >
                    {feedbackMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={handleComplete}
                disabled={phase !== 'playing'}
                className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 text-lg font-bold text-slate-950 shadow-lg disabled:opacity-50"
              >
                완성 확인 ✨
              </button>

              <button
                type="button"
                onClick={handleSkip}
                disabled={phase === 'reveal'}
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-slate-300 shadow-sm hover:bg-white/10 disabled:opacity-30"
              >
                {phase === 'result' ? '다음으로 바로 가기 ⏭️' : '건너뛰기 ⏭️'}
              </button>


              {(operatorMode || strictMode) && (
                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-300">
                    🛡 운영자 모드{strictMode ? ' · 엄격 판정' : ''}
                  </p>
                  <p className="mt-1 text-xs text-emerald-100/70">
                    아이에게 보여주지 마세요. URL의 ?admin=true 또는 ?strict=true로 진입.
                  </p>
                  {operatorMode && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setShowSolution(true)}
                        disabled={!scene.officialSolution}
                        className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-bold text-slate-950 shadow disabled:opacity-40"
                      >
                        공식 정답 보기
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowHint(true)}
                        className="rounded-xl bg-emerald-500/20 px-3 py-2 text-sm font-bold text-emerald-100 ring-1 ring-emerald-400/40"
                      >
                        힌트 모두 보기
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <StoryOverlay
          text={scene.storyText}
          characterName={scene.characterName}
          visible={phase === 'story'}
          onDismiss={handleStoryDismiss}
          buttonText={scene.title ?? '시작하기 ▶'}
        />

        <AnimatePresence>
          {phase === 'reveal' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/90 px-4 backdrop-blur"
            >
              <motion.div
                key={revealIndex}
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="w-full max-w-xl rounded-[2rem] border border-gold/40 bg-slate-900 p-6 text-center shadow-2xl"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gold/20 text-5xl">
                  {REVEAL_SCENES[revealIndex].icon}
                </div>
                <p className="whitespace-pre-line break-keep text-lg font-bold leading-relaxed text-white">
                  {REVEAL_SCENES[revealIndex].text}
                </p>
                <button
                  type="button"
                  onClick={handleRevealNext}
                  className="mt-6 w-full max-w-sm rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 text-lg font-bold text-slate-950 shadow-lg"
                >
                  {REVEAL_SCENES[revealIndex].button}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <HintModal
          open={showHint}
          onClose={() => setShowHint(false)}
          stages={getHintStages(scene)}
          hintsRemaining={hintsRemaining}
          missionId={scene.id}
        />

        {operatorMode && scene.officialSolution && (
          <Modal
            open={showSolution}
            onClose={() => setShowSolution(false)}
            cardClassName="rounded-2xl p-5 max-w-2xl w-full mx-4 shadow-2xl"
            cardStyle={{ background: '#0f172a', border: '1px solid rgba(52,211,153,0.4)' }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡</span>
                <h2 className="font-fredoka text-xl text-emerald-300">
                  공식 정답 — {scene.title ?? `메모 ${currentSceneIndex + 1}`}
                </h2>
                <span className="ml-auto text-xs text-emerald-100/60">큐브 {scene.officialSolution.length}개</span>
              </div>
              <div className="h-[360px] w-full overflow-hidden rounded-xl">
                <CubeViewer cubes={scene.officialSolution} />
              </div>
              <button
                type="button"
                onClick={() => setShowSolution(false)}
                className="self-end rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950"
              >
                닫기
              </button>
            </div>
          </Modal>
        )}
      </div>
    </PageTransition>
  );
}
