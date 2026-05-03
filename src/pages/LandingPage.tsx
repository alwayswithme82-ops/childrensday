import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../components/landing/Logo';
import { NicknameInput } from '../components/landing/NicknameInput';
import { DifficultyCard } from '../components/landing/DifficultyCard';
import { Button } from '../components/shared/Button';
import { MuteToggle } from '../components/shared/MuteToggle';
import { PageTransition } from '../components/layout/PageTransition';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useSound } from '../hooks/useSound';
import type { Difficulty } from '../types/game';

const BALLOONS = [
  { icon: '🎈', x: 4,  y: 18, cls: 'balloon-0', size: 'text-5xl' },
  { icon: '🎀', x: 91, y: 12, cls: 'balloon-1', size: 'text-4xl' },
  { icon: '🎈', x: 87, y: 52, cls: 'balloon-2', size: 'text-6xl' },
  { icon: '🎉', x: 6,  y: 62, cls: 'balloon-3', size: 'text-4xl' },
  { icon: '🎈', x: 48, y: 3,  cls: 'balloon-4', size: 'text-5xl' },
  { icon: '🎊', x: 78, y: 80, cls: 'balloon-0', size: 'text-3xl' },
  { icon: '🎀', x: 18, y: 85, cls: 'balloon-1', size: 'text-3xl' },
];

const SPARKLES = [
  { icon: '⭐', x: 12, y: 8,  dur: '2s',   delay: '0s' },
  { icon: '✨', x: 82, y: 22, dur: '1.5s', delay: '0.4s' },
  { icon: '🌟', x: 22, y: 75, dur: '2.5s', delay: '0.8s' },
  { icon: '⭐', x: 68, y: 72, dur: '1.8s', delay: '0.3s' },
  { icon: '✨', x: 55, y: 92, dur: '2.2s', delay: '1s' },
  { icon: '🌟', x: 35, y: 5,  dur: '1.6s', delay: '0.6s' },
  { icon: '💫', x: 95, y: 42, dur: '2.4s', delay: '1.2s' },
  { icon: '✨', x: 3,  y: 42, dur: '2s',   delay: '1.5s' },
];

const PROLOGUE = [
  {
    title: '이상한 초대장',
    icon: '✉️',
    animation: 'invite',
    bg: 'linear-gradient(160deg, #FFF7AD 0%, #FFD6E7 52%, #FFE8B5 100%)',
    text: '띵동!\n어린이날 아침,\n네 앞에 반짝이는 큐브 초대장이 도착했어요.\n‘도와줘! 큐브 왕국의 보물이 사라졌어!’',
  },
  {
    title: '큐브 왕국으로!',
    icon: '🧊',
    animation: 'portal',
    bg: 'radial-gradient(circle at 50% 45%, rgba(199,125,255,0.55), transparent 32%), linear-gradient(150deg, #312E81 0%, #4D96FF 48%, #C77DFF 100%)',
    text: '초대장을 펼치는 순간,\n큐브들이 빙글빙글 돌기 시작했어요!\n눈을 떠보니\n너는 신비한 큐브 왕국에 도착해 있었어요.',
  },
  {
    title: '큐브 요정 루비의 부탁',
    icon: '🧚',
    animation: 'ruby',
    bg: 'linear-gradient(160deg, #CFFAFE 0%, #D1FAE5 52%, #E0F2FE 100%)',
    text: '안녕! 나는 큐브 요정 루비야!\n황금 보물상자가 검은 그림자 마법에 잠겨버렸어!\n보물을 찾으려면 네 도움이 필요해!',
  },
  {
    title: '모험의 시작',
    icon: '🗝️',
    animation: 'keys',
    bg: 'radial-gradient(circle at 50% 25%, rgba(245,158,11,0.45), transparent 34%), linear-gradient(160deg, #0F172A 0%, #1B2A4A 55%, #F59E0B 150%)',
    text: '보물상자를 열려면\n네 개의 열쇠 조각을 찾아야 해요.\n🚪 그림자 문\n🗺️ 보물지도 바닥\n📦 숨은 큐브 창고\n🏰 비밀 보물탑\n큐브 왕국으로 모험을 떠나볼까요?',
  },
];

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  left: `${6 + ((i * 23) % 88)}%`,
  top: `${8 + ((i * 31) % 82)}%`,
  delay: i * 0.17,
  duration: 2.4 + (i % 5) * 0.32,
}));

type LandingStep = 'start' | 'prologue' | 'name' | 'difficulty';

function PrologueCard({
  index,
  onNext,
}: {
  index: number;
  onNext: () => void;
}) {
  const scene = PROLOGUE[index];
  const [displayed, setDisplayed] = useState('');
  const done = displayed.length >= scene.text.length;

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timer = window.setInterval(() => {
      i += 2;
      setDisplayed(scene.text.slice(0, i));
      if (i >= scene.text.length) window.clearInterval(timer);
    }, 18);
    return () => window.clearInterval(timer);
  }, [scene.text]);

  const reveal = () => {
    if (!done) setDisplayed(scene.text);
  };

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      onClick={reveal}
      className="relative w-full overflow-hidden rounded-[2rem] border-[3px] border-white bg-white/88 p-5 text-center shadow-2xl backdrop-blur sm:p-6"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.15, 0.75, 0.15], y: [0, -12, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute text-sm text-yellow-300"
            style={{ left: p.left, top: p.top }}
          >
            ✦
          </motion.span>
        ))}
      </div>

      <div className="relative mx-auto mb-4 flex h-24 w-28 items-center justify-center sm:h-28">
        {scene.animation !== 'keys' && (
          <motion.div
            initial={scene.animation === 'invite' ? { y: 80, scale: 0.6, rotate: -8 } : { y: 12, scale: 0.86 }}
            animate={
              scene.animation === 'invite'
                ? { y: 0, scale: 1, rotate: 0 }
                : scene.animation === 'portal'
                  ? { rotate: 360, scale: [1, 1.1, 1] }
                  : { y: [0, -14, 0] }
            }
            transition={
              scene.animation === 'invite'
                ? { type: 'spring', stiffness: 260, damping: 18 }
                : { duration: scene.animation === 'portal' ? 2.2 : 1.8, repeat: Infinity, ease: 'easeInOut' }
            }
            className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-yellow-100 text-5xl shadow-inner sm:h-24 sm:w-24 sm:text-6xl"
          >
            {scene.icon}
          </motion.div>
        )}
        {scene.animation === 'keys' && (
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.18 } } }}
            initial="hidden"
            animate="show"
            className="flex items-center justify-center gap-2"
          >
            {[0, 1, 2, 3].map(i => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.6 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 360, damping: 18 } },
                }}
                className="text-4xl drop-shadow sm:text-5xl"
              >
                <motion.span
                  animate={{ opacity: [1, 0.65, 1], y: [0, -6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.18 }}
                  className="inline-block"
                >
                  🗝️
                </motion.span>
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>

      <p className="font-fredoka text-2xl text-[#FF6B6B]">{index + 1}장. {scene.title}</p>
      <p className="mt-4 min-h-[10rem] whitespace-pre-line break-keep text-base leading-relaxed text-slate-700 sm:min-h-[12rem] sm:text-lg">
        {displayed}
        {!done && <span className="ml-0.5 inline-block animate-pulse text-gold">|</span>}
      </p>
      {!done && (
        <p className="mt-2 text-xs font-bold text-slate-400">화면을 누르면 바로 읽을 수 있어요</p>
      )}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="mt-6"
          >
            <Button size="lg" className="w-full max-w-sm" onClick={onNext}>
              {index + 1 >= PROLOGUE.length ? '좋아! 출발하자 🚀' : '다음 ▶'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex justify-center gap-2">
        {PROLOGUE.map((_, i) => (
          <motion.span
            key={i}
            animate={{
              scale: i === index ? 1.45 : 1,
              backgroundColor: i === index ? '#F59E0B' : '#CBD5E1',
              boxShadow: i === index ? '0 0 14px rgba(245,158,11,0.75)' : '0 0 0 rgba(0,0,0,0)',
            }}
            className="h-2.5 w-2.5 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  const [step, setStep] = useState<LandingStep>('start');
  const [prologueIndex, setPrologueIndex] = useState(0);
  const [nickname, setNickname] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startGame } = useGameStore();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { play } = useSound();

  const isNicknameValid = nickname.trim().length >= 1;
  const canStart = isNicknameValid && difficulty !== null && !isLoading;

  const handleStart = async () => {
    if (!canStart || !difficulty) return;
    play('click');
    setError(null);
    setIsLoading(true);
    try {
      await login(nickname.trim());
      startGame(difficulty, nickname.trim());
      navigate('/game');
    } catch {
      setError('로그인 중 문제가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: step === 'prologue' ? PROLOGUE[prologueIndex].bg : 'linear-gradient(160deg, #FFFDE7 0%, #FCE4EC 35%, #E3F2FD 65%, #F3E5F5 100%)', transition: 'background 600ms ease' }}
      >
        {/* 무지개 상단 띠 */}
        <div
          className="absolute top-0 left-0 right-0 h-2"
          style={{ background: 'linear-gradient(90deg,#FF6B6B,#FFD93D,#6BCB77,#4D96FF,#C77DFF)' }}
        />

        {/* 풍선 데코 */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {BALLOONS.map((b, i) => (
            <span
              key={i}
              className={`absolute ${b.size} ${b.cls} select-none`}
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
            >
              {b.icon}
            </span>
          ))}

          {/* 반짝이 별 */}
          {SPARKLES.map((s, i) => (
            <span
              key={i}
              className="absolute twinkle text-2xl select-none"
              style={{ left: `${s.x}%`, top: `${s.y}%`, '--dur': s.dur, animationDelay: s.delay } as React.CSSProperties}
            >
              {s.icon}
            </span>
          ))}

          {/* 구름 */}
          <span className="absolute text-5xl opacity-60 select-none" style={{ left: '10%', top: '30%' }}>☁️</span>
          <span className="absolute text-4xl opacity-50 select-none" style={{ left: '75%', top: '8%' }}>☁️</span>
          <span className="absolute text-6xl opacity-40 select-none" style={{ left: '60%', top: '60%' }}>☁️</span>
        </div>

        {/* 음소거 토글 */}
        <div className="absolute top-5 right-5 z-10">
          <MuteToggle />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-4xl px-4 py-8 sm:py-16">

          {step === 'start' ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-[2.2rem] border-[4px] border-white bg-white/80 p-6 text-center shadow-2xl backdrop-blur sm:p-10"
            >
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                {['🧊', '🗝️', '💎', '⭐', '📦', '✨'].map((icon, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 2 + i * 0.25, repeat: Infinity, delay: i * 0.2 }}
                    className="absolute text-3xl opacity-60"
                    style={{ left: `${10 + (i * 16) % 78}%`, top: `${12 + (i * 19) % 70}%` }}
                  >
                    {icon}
                  </motion.span>
                ))}
              </div>

              <div className="relative z-10 flex flex-col items-center gap-5">
                <motion.div
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                  className="text-7xl"
                >
                  🧊
                </motion.div>
                <div>
                  <h1
                    className="font-fredoka leading-none"
                    style={{
                      fontSize: 'clamp(3.2rem, 10vw, 6.2rem)',
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 42%, #6BCB77 72%, #4D96FF 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    큐브 왕국의 보물찾기
                  </h1>
                  <p className="mt-4 break-keep text-lg font-bold text-slate-600">
                    사라진 황금 보물을 찾아 떠나는 큐브 모험!
                  </p>
                </div>
                <div className="flex w-full max-w-sm flex-col gap-3">
                  <Button
                    size="lg"
                    className="w-full"
                    pulse
                    onClick={() => {
                      play('click');
                      setStep('prologue');
                    }}
                  >
                    🎮 게임 시작
                  </Button>
                  <Button size="md" variant="outline" className="w-full" onClick={() => navigate('/leaderboard')}>
                    🏆 리더보드 보기
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : step === 'prologue' ? (
            <AnimatePresence mode="wait">
              <PrologueCard
                key={prologueIndex}
                index={prologueIndex}
                onNext={() => {
                  play('click');
                  if (prologueIndex + 1 >= PROLOGUE.length) {
                    setStep('name');
                  } else {
                    setPrologueIndex(i => i + 1);
                  }
                }}
              />
            </AnimatePresence>
          ) : (
            <>
              <Logo />

              {step === 'name' ? (
                <>
                  <div className="w-full max-w-lg rounded-3xl bg-white/70 p-4 text-center shadow-md backdrop-blur">
                    <p className="break-keep text-base font-bold leading-relaxed text-slate-600">
                      루비가 말했어요.<br />
                      “먼저 너의 이름을 알려줘!<br />
                      보물을 찾으면 인증서에 적어줄게.”
                    </p>
                  </div>

                  <NicknameInput value={nickname} onChange={setNickname} />

                  <Button
                    size="lg"
                    onClick={() => {
                      if (!isNicknameValid) return;
                      play('click');
                      setStep('difficulty');
                    }}
                    disabled={!isNicknameValid}
                    pulse={isNicknameValid}
                    className="w-full max-w-xs"
                  >
                    다음: 모험길 고르기 🧭
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-full max-w-lg rounded-3xl bg-white/70 p-4 text-center shadow-md backdrop-blur">
                    <p className="break-keep text-base font-bold leading-relaxed text-slate-600">
                      루비가 세 갈래 길을 보여주었어요.<br />
                      “어떤 길로 모험을 떠나볼래?”
                    </p>
                  </div>

                  <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                        <DifficultyCard
                          key={d}
                          difficulty={d}
                          selected={difficulty === d}
                          onSelect={d => { setDifficulty(d); play('click'); }}
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleStart}
                    disabled={!canStart}
                    pulse={canStart && !isLoading}
                    className="w-full max-w-xs"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                          style={{ display: 'inline-block' }}
                        >
                          ⚙
                        </motion.span>
                        잠깐만...
                      </span>
                    ) : '열쇠 조각 찾으러 출발! 🗝️'}
                  </Button>
                </>
              )}

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="font-fredoka text-sm text-red-500"
                  >
                    ⚠️ {error}
                  </motion.p>
                )}
                {!error && step === 'name' && !isNicknameValid && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-fredoka text-sm"
                    style={{ color: '#aaa' }}
                  >
                    이름을 입력하고 모험 길을 선택하면 시작돼요 ✨
                  </motion.p>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {step !== 'start' && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/leaderboard')}
            className="absolute bottom-6 right-6 font-fredoka text-sm px-4 py-2 rounded-full transition-all"
            style={{
              background: 'rgba(255,255,255,0.7)',
              color: '#4D96FF',
              boxShadow: '0 2px 12px rgba(77,150,255,0.2)',
              backdropFilter: 'blur(4px)',
            }}
          >
            🏆 리더보드
          </motion.button>
        )}

        {/* 무지개 하단 띠 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5"
          style={{ background: 'linear-gradient(90deg,#C77DFF,#4D96FF,#6BCB77,#FFD93D,#FF6B6B)' }}
        />
      </div>
    </PageTransition>
  );
}
