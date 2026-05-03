import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { GameHUD } from '../components/game/GameHUD';
import { CubeBuilder } from '../components/game/CubeBuilder';
import { TargetProjectionCard } from '../components/game/TargetProjectionCard';
import { StoryOverlay } from '../components/game/StoryOverlay';
import { HintModal } from '../components/game/HintModal';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { getBuildLevelByDifficulty } from '../data/buildLevels';
import { useTimer } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import { calcStars } from '../utils/helpers';
import { validateBuildMission } from '../services/projection.service';
import type { CubeData } from '../types/game';

type Phase = 'story' | 'playing' | 'result' | 'treasure';

const RUBY_CORRECT = [
  '와! 진짜 잘했어!',
  '역시 어린이 건축가야!',
  '큐브 왕국이 점점 밝아지고 있어!',
];

const RUBY_WRONG = [
  '괜찮아, 거의 다 왔어!',
  '다시 보면 보일 거야!',
  '큐브는 돌려보면 비밀을 알려줘!',
];

const MISSION_INTROS = [
  {
    text: '커다란 돌문이 길을 막고 있어요.\n문에는 이상한 큐브 그림자가 새겨져 있어요.\n루비가 속삭였어요.\n‘이 문은 앞에서 본 큐브 그림자를 맞혀야 열려!’',
    button: '그림자 문 열기 👀',
  },
  {
    text: '문을 지나자 바닥에 희미한 지도가 나타났어요.\n하지만 지도는 큐브 조각이 빠져 있어서 완성되지 않았어요.\n루비가 말했어요.\n‘위에서 봤을 때 지도 모양이 되도록 큐브를 놓아야 해!’',
    button: '지도 완성하기 🧊',
  },
  {
    text: '창고 안에는 큐브 상자가 높이높이 쌓여 있어요.\n어떤 큐브는 앞에서 보이지 않게 숨어 있었어요.\n루비가 눈을 크게 떴어요.\n‘보이는 큐브만 세면 안 돼!\n숨어 있는 큐브까지 찾아야 해.’',
    button: '숨은 큐브 찾기 🔍',
  },
  {
    text: '드디어 보물상자 앞에 도착했어요.\n하지만 상자 앞에는 무너진 큐브탑이 있었어요.\n루비가 말했어요.\n‘이 탑은 앞에서 봐도,\n위에서 봐도,\n마법 문양과 똑같아야 해.\n이 탑을 완성하면 마지막 열쇠가 나타날 거야!’',
    button: '보물탑 완성하기 🏗️',
  },
];

const TREASURE_SCENES = [
  {
    text: '네 개의 열쇠 조각이 공중으로 떠올랐어요.\n🗝️ 🗝️ 🗝️ 🗝️\n조각들이 빙글빙글 돌더니\n하나의 황금 열쇠로 합쳐졌어요.\n루비가 환하게 웃었어요.\n‘이제 보물상자를 열 수 있어!’',
    button: '황금 열쇠 꽂기 🗝️',
  },
  {
    text: '철컥!\n보물상자가 천천히 열렸어요.\n안에서는 눈부신 빛이 쏟아져 나왔어요.\n그런데 상자 안에는 금화보다 더 특별한 것이 들어 있었어요.',
    button: '상자 안 들여다보기 💎',
  },
  {
    text: '상자 안에는 작은 편지가 들어 있었어요.\n‘진짜 보물은 정답을 맞히는 힘이 아니라,\n다르게 바라보는 힘이야.’\n루비가 말했어요.\n‘너는 앞에서도 보고,\n위에서도 보고,\n왼쪽에서도 보며\n큐브 왕국의 마법을 풀었어!’',
    button: '계속 보기 ✨',
  },
  {
    text: '축하해요!\n당신은 큐브 왕국의 황금 보물을 찾아낸\n어린이 창의력 건축가입니다!',
    button: '인증서 받기 🎖️',
  },
];

function getRewardMessage(index: number) {
  const rewards = [
    '철컥!\n무거운 그림자 문이 열렸어요.\n문 안쪽에서 첫 번째 열쇠 조각이 반짝였어요.\n첫 번째 열쇠 조각 획득! 🗝️',
    '반짝!\n바닥의 보물지도가 황금빛으로 빛났어요.\n지도 한가운데에서 두 번째 열쇠 조각이 떠올랐어요.\n두 번째 열쇠 조각 획득! 🗝️',
    '딩동댕!\n숨어 있던 큐브들이 통통 튀어나왔어요.\n그중 하나가 세 번째 열쇠 조각으로 변했어요.\n세 번째 열쇠 조각 획득! 🗝️',
    '쿠구궁…!\n큐브탑이 황금빛으로 빛나기 시작했어요.\n탑 꼭대기에서 마지막 열쇠 조각이 내려왔어요.\n마지막 열쇠 조각 획득! 🗝️',
  ];
  return rewards[Math.min(index, rewards.length - 1)];
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
  const [builtCubes, setBuiltCubes] = useState<CubeData[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [rubyMessage, setRubyMessage] = useState<string>('루비가 함께 모험 중이에요!');
  const [treasureIndex, setTreasureIndex] = useState(0);
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
    setBuiltCubes([]);
    setFeedbackMessage(null);
    setRubyMessage('루비가 함께 모험 중이에요!');
    timer.pause();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSceneIndex]);

  if (!difficulty) return null;

  const level = getBuildLevelByDifficulty(difficulty);
  const scene = level.scenes[currentSceneIndex];
  if (!scene) return null;

  const totalStars = sceneResults.reduce((s, r) => s + r.stars, 0);
  const successShowing = phase === 'result' && feedbackMessage === (scene.successText ?? getRewardMessage(currentSceneIndex));
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
      setRubyMessage(RUBY_CORRECT[currentSceneIndex % RUBY_CORRECT.length]);
      setFeedbackMessage(scene.successText ?? getRewardMessage(Math.min(currentSceneIndex, 3)));
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
          setTreasureIndex(0);
          setPhase('treasure');
        } else {
          nextScene();
        }
      }, 1500);
    } else {
      play('wrong');
      setRubyMessage(RUBY_WRONG[newAttempts % RUBY_WRONG.length]);
      setFeedbackMessage(validation.message);
    }
  };

  const handleTreasureNext = () => {
    play('click');
    if (treasureIndex + 1 >= TREASURE_SCENES.length) {
      navigate('/result');
      return;
    }
    setTreasureIndex(i => i + 1);
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
                disabled={phase !== 'playing'}
                onLimit={() => {
                  setRubyMessage('괜찮아! 큐브 수를 다시 맞춰보자.');
                  setFeedbackMessage('큐브를 너무 많이 쌓았어요!');
                }}
              />
            </div>

            {/* 우측: 목표 조건 + 완료 확인 */}
            <div className="md:w-[40%] p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 overflow-visible md:overflow-y-auto">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gold">{scene.title ?? `보물의 방 ${currentSceneIndex + 1}`}</p>
                <p className="mt-2 text-lg text-white font-medium leading-snug">{scene.questionText}</p>
                <div className="mt-3 rounded-xl bg-slate-950/70 px-3 py-2 text-sm font-bold text-pink-200">
                  루비: “{rubyMessage}”
                </div>
              </div>

              <TargetProjectionCard
                targets={scene.targetProjections ?? {}}
                exactCubes={scene.exactCubes}
                minCubes={scene.minCubes}
                maxCubes={scene.maxCubes}
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
          {phase === 'treasure' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/90 px-4 backdrop-blur"
            >
              <motion.div
                key={treasureIndex}
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="w-full max-w-xl rounded-[2rem] border border-gold/40 bg-slate-900 p-6 text-center shadow-2xl"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gold/20 text-5xl">
                  {treasureIndex === 0 ? '🗝️' : treasureIndex === 1 ? '💎' : treasureIndex === 2 ? '✉️' : '🎖️'}
                </div>
                <p className="whitespace-pre-line break-keep text-lg font-bold leading-relaxed text-white">
                  {TREASURE_SCENES[treasureIndex].text}
                </p>
                <button
                  type="button"
                  onClick={handleTreasureNext}
                  className="mt-6 w-full max-w-sm rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 text-lg font-bold text-slate-950 shadow-lg"
                >
                  {TREASURE_SCENES[treasureIndex].button}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
