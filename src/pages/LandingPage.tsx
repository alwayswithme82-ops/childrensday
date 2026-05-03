import { useState } from 'react';
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
    title: '1장: 이상한 초대장',
    text: '띵동!\n어린이날 아침,\n네 앞에 반짝이는 큐브 모양 초대장이 도착했어요.\n초대장에는 이렇게 적혀 있었어요.\n‘도와줘! 큐브 왕국의 보물이 사라졌어!’',
    button: '초대장 열어보기 ✉️',
  },
  {
    title: '2장: 큐브 왕국으로 빨려 들어가다',
    text: '초대장을 펼치는 순간,\n휘이이잉!\n빨강, 파랑, 노랑 큐브들이 빙글빙글 돌기 시작했어요.\n그리고 눈을 떠보니…\n너는 큐브로 만들어진 신비한 왕국에 도착해 있었어요!',
    button: '큐브 왕국 둘러보기 🧊',
  },
  {
    title: '3장: 울고 있는 큐브 요정 루비',
    text: '그때 작은 큐브 요정이 날아왔어요.\n‘나는 큐브 요정 루비야!\n우리 왕국의 황금 보물상자가\n검은 그림자 마법에 잠겨버렸어!’\n루비는 반짝이는 눈으로 너를 바라보았어요.',
    button: '루비의 이야기 듣기 ✨',
  },
  {
    title: '4장: 검은 그림자 마법',
    text: '그림자 마법은 아주 이상해.\n큐브를 앞에서 보면 다르게 보이고,\n위에서 보면 또 다르게 보이고,\n왼쪽에서 보면 완전히 다른 모양이 돼!\n하지만 네가 큐브를 잘 살펴보면\n마법을 풀 수 있을 거야!',
    button: '내가 해볼게! 💪',
  },
  {
    title: '5장: 네 개의 열쇠 조각',
    text: '황금 보물상자를 열려면\n네 개의 열쇠 조각이 필요해요.\n열쇠 조각은 큐브 왕국의 네 장소에 숨어 있어요.\n🚪 그림자 문\n🗺️ 보물지도 바닥\n📦 숨은 큐브 창고\n🏰 비밀 보물탑',
    button: '열쇠 조각 찾으러 가기 🗝️',
  },
];

export function LandingPage() {
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
  const prologueDone = prologueIndex >= PROLOGUE.length;

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
        style={{
          background: 'linear-gradient(160deg, #FFFDE7 0%, #FCE4EC 35%, #E3F2FD 65%, #F3E5F5 100%)',
        }}
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
        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl px-4 py-16">

          {!prologueDone ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={prologueIndex}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full rounded-[2rem] border-[3px] border-white bg-white/85 p-6 text-center shadow-2xl backdrop-blur"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-100 text-4xl shadow-inner">
                  🧊
                </div>
                <p className="font-fredoka text-xl text-[#FF6B6B]">{PROLOGUE[prologueIndex].title}</p>
                <p className="mt-4 whitespace-pre-line break-keep text-lg leading-relaxed text-slate-700">
                  {PROLOGUE[prologueIndex].text}
                </p>
                <Button
                  size="lg"
                  className="mt-6 w-full max-w-sm"
                  onClick={() => {
                    play('click');
                    setPrologueIndex(i => i + 1);
                  }}
                >
                  {PROLOGUE[prologueIndex].button}
                </Button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              <Logo />

              <div className="w-full max-w-lg rounded-3xl bg-white/70 p-4 text-center shadow-md backdrop-blur">
                <p className="break-keep text-base font-bold leading-relaxed text-slate-600">
                  루비가 작은 마법 펜을 꺼냈어요.<br />
                  “먼저 너의 이름을 알려줘! 보물을 찾으면 큐브 왕국 인증서에 새겨줄게.”
                </p>
              </div>

              <NicknameInput value={nickname} onChange={setNickname} />

              <div className="w-full">
                <p
                  className="text-center mb-2 font-fredoka text-lg tracking-wider"
                  style={{ color: '#FF6B6B' }}
                >
                  루비가 세 갈래 길을 보여주었어요.
                </p>
                <p className="mb-4 text-center text-sm font-bold text-slate-500">
                  “어떤 길로 모험을 떠나볼래?”
                </p>
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
                {!error && !isNicknameValid && (
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

        {/* 리더보드 링크 */}
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

        {/* 무지개 하단 띠 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5"
          style={{ background: 'linear-gradient(90deg,#C77DFF,#4D96FF,#6BCB77,#FFD93D,#FF6B6B)' }}
        />
      </div>
    </PageTransition>
  );
}
