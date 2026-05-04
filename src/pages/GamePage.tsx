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
import { evaluateRule, validateBuildMission } from '../utils/buildValidation';
import type { CubeData } from '../types/game';

type Phase = 'story' | 'playing' | 'result' | 'reveal';

const KING_CORRECT = [
  '메모대로 정확해. 다음 단서를 줄게.',
  '훌륭한 솜씨야. 비밀 건물이 한 층 더 자랐어.',
  '큐브왕의 후계자가 될 자격이 있군!',
];

const KING_WRONG = [
  '음… 메모를 다시 한번 읽어볼래?',
  '아쉬워. 색깔과 위치를 다시 살펴봐.',
  '거의 다 왔어. 메모의 한 줄을 빼먹지 않았는지 확인해봐.',
];

const MISSION_INTROS = [
  {
    text:
      '색나무 마을 광장에 오래된 양피지 한 장이 떨어져 있었어요.\n‘큐브왕의 첫 번째 메모’라고 적혀 있었죠.\n어떤 색깔 큐브를 몇 개 모아야 할지\n메모를 따라 재료를 모아 보세요.',
    button: '첫 번째 메모 펼치기 📜',
  },
  {
    text:
      '비밀 건물의 첫 번째 벽이 모습을 드러냈어요.\n그런데 두 번째 메모에는\n‘색깔이 만나는 방법’에 대한 비밀이 적혀 있었어요.\n어떤 색이 어떻게 붙어야 할까요?',
    button: '두 번째 메모 펼치기 📜',
  },
  {
    text:
      '벽이 한 층 더 자라났어요.\n세 번째 메모에는\n‘위에서 본 모습’에 대한 단서가 있었어요.\n파란 큐브 4개 중 단 하나만\n위에서 보여야 한대요. 어떻게 숨길까요?',
    button: '세 번째 메모 펼치기 📜',
  },
  {
    text:
      '드디어 마지막 메모가 빛나기 시작했어요.\n노란 큐브가 하나 더해지고,\n앞에서 보이는 블록 수와 뒤에서 보이는 블록 수가\n같아야 비밀 건물이 열린대요.\n노랑은 앞에서 보이지 않게 숨겨 보세요.',
    button: '마지막 메모 펼치기 📜',
  },
];

const REVEAL_SCENES = [
  {
    icon: '🗝️',
    text:
      '네 장의 메모가 공중으로 떠올랐어요.\n📜 📜 📜 📜\n메모들이 빙글빙글 돌더니\n하나의 황금 열쇠로 합쳐졌어요.',
    button: '비밀 건물 열기 🗝️',
  },
  {
    icon: '🏛',
    text:
      '쿠구궁…!\n색나무 마을 광장 한가운데에\n작은 비밀 건물이 솟아올랐어요.\n색깔 큐브로 지어진,\n세상에 단 하나뿐인 건물이에요.',
    button: '안으로 들어가기 ✨',
  },
  {
    icon: '✉️',
    text:
      '건물 안에는 큐브왕의 마지막 편지가 있었어요.\n‘진짜 큐브왕은 정답을 잘 외운 사람이 아니라,\n앞·위·옆에서 모두 살펴보는 사람이란다.’',
    button: '계속 보기 🌳',
  },
  {
    icon: '🎖️',
    text:
      '축하해요!\n오늘부터 너는 색나무 마을의\n어린이 건축가야.\n다음 큐브왕은 너일지도 몰라.',
    button: '건축가 인증서 받기 🎖️',
  },
];

function getRewardMessage(index: number, fallback?: string) {
  const rewards = [
    '딸칵!\n첫 번째 메모의 봉인이 풀렸어요.\n비밀 건물의 “재료”가 모두 모였어요. 📜',
    '반짝!\n두 번째 메모가 빛나며,\n비밀 건물의 벽이 한 층 자라났어요. 📜',
    '띵—!\n세 번째 메모가 사르륵 펼쳐졌어요.\n위에서 본 모습이 메모와 정확히 일치해요. 📜',
    '쿠구궁…!\n마지막 메모가 황금빛으로 빛나요.\n비밀 건물이 모두 완성됐어요! 📜',
  ];
  return rewards[Math.min(index, rewards.length - 1)] ?? fallback ?? '잘했어요!';
}

export function GamePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const operatorMode = searchParams.get('admin') === 'true';
  const {
    difficulty, currentSceneIndex, sceneResults,
    hintsRemaining, nextScene, recordSceneResult, useHint,
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
  const keyPieces = Math.min(sceneResults.length + (successShowing ? 1 : 0), 4);
  const mission = MISSION_INTROS[Math.min(currentSceneIndex, MISSION_INTROS.length - 1)];

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
    const validation = validateBuildMission(builtCubes, scene);
    if (validation.success) {
      play('correct');
      timer.pause();
      setKingMessage(KING_CORRECT[currentSceneIndex % KING_CORRECT.length]);
      setFeedbackMessage(getRewardMessage(currentSceneIndex, scene.successText));
      setPhase('result');
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
                maxCubes={scene.maxCubes ?? scene.exactCubes ?? 10}
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

              {operatorMode && (
                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-300">
                    🛡 운영자 모드
                  </p>
                  <p className="mt-1 text-xs text-emerald-100/70">
                    아이에게 보여주지 마세요. URL의 ?admin=true로 진입.
                  </p>
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
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <StoryOverlay
          text={mission.text}
          characterName={scene.characterName}
          visible={phase === 'story'}
          onDismiss={handleStoryDismiss}
          buttonText={mission.button}
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
