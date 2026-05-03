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

export function LandingPage() {
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

          <Logo />

          <NicknameInput value={nickname} onChange={setNickname} />

          <div className="w-full">
            <p
              className="text-center mb-4 font-fredoka text-lg tracking-wider"
              style={{ color: '#FF6B6B' }}
            >
              🌈 난이도를 골라봐! 🌈
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
            ) : '🚀 모험 시작!'}
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
                이름을 입력하고 난이도를 선택하면 시작돼요 ✨
              </motion.p>
            )}
          </AnimatePresence>
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
