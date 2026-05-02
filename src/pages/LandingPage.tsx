import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from '../components/landing/Logo';
import { NicknameInput } from '../components/landing/NicknameInput';
import { DifficultyCard } from '../components/landing/DifficultyCard';
import { Button } from '../components/shared/Button';
import { MuteToggle } from '../components/shared/MuteToggle';
import { PageTransition } from '../components/layout/PageTransition';
import { useGameStore } from '../stores/useGameStore';
import { useSound } from '../hooks/useSound';
import type { Difficulty } from '../types/game';

/* 배경 장식 도형 */
const BLOBS = [
  { cx: '10%',  cy: '15%', r: 180, color: 'rgba(245,184,0,0.18)' },
  { cx: '90%',  cy: '10%', r: 140, color: 'rgba(251,191,36,0.14)' },
  { cx: '80%',  cy: '70%', r: 200, color: 'rgba(253,230,138,0.20)' },
  { cx: '5%',   cy: '75%', r: 120, color: 'rgba(245,184,0,0.10)' },
  { cx: '50%',  cy: '50%', r: 300, color: 'rgba(255,251,239,0.00)' },
];

/* 떠다니는 이모지 */
const FLOATERS = [
  { emoji: '⭐', x: '8%',  y: '20%', dur: 4,   delay: 0   },
  { emoji: '🌟', x: '92%', y: '15%', dur: 5,   delay: 1   },
  { emoji: '✨', x: '15%', y: '70%', dur: 3.5, delay: 0.5 },
  { emoji: '⭐', x: '85%', y: '65%', dur: 4.5, delay: 2   },
  { emoji: '🌟', x: '50%', y: '8%',  dur: 3,   delay: 1.5 },
  { emoji: '✨', x: '70%', y: '85%', dur: 5,   delay: 0.8 },
  { emoji: '⭐', x: '30%', y: '88%', dur: 4,   delay: 2.5 },
];

export function LandingPage() {
  const [nickname, setNickname] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const { startGame } = useGameStore();
  const navigate = useNavigate();
  const { play } = useSound();

  const isNicknameValid = /^[가-힣a-zA-Z0-9]{1,6}$/.test(nickname.trim());
  const canStart = isNicknameValid && difficulty !== null;

  const handleStart = () => {
    if (!canStart || !difficulty) return;
    play('click');
    startGame(difficulty, nickname.trim());
    navigate('/game');
  };

  return (
    <PageTransition>
      <div
        className="relative min-h-screen flex flex-col overflow-x-hidden"
        style={{
          background: 'linear-gradient(160deg, #FFFDF5 0%, #FFFBEF 40%, #FEF9E0 70%, #FEF3C7 100%)',
        }}
      >
        {/* ── 배경 Blob ── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
          {BLOBS.map((b, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl"
              style={{
                left: b.cx, top: b.cy,
                width: b.r * 2, height: b.r * 2,
                background: b.color,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ scale: [1, 1.1, 1], x: [0, 10, 0] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i }}
            />
          ))}
        </div>

        {/* ── 떠다니는 이모지 ── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
          {FLOATERS.map((f, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl select-none"
              style={{ left: f.x, top: f.y, opacity: 0.35 }}
              animate={{ y: [0, -14, 0], rotate: [-5, 5, -5] }}
              transition={{ duration: f.dur, repeat: Infinity, delay: f.delay, ease: 'easeInOut' }}
            >
              {f.emoji}
            </motion.span>
          ))}
        </div>

        {/* ── 헤더 ── */}
        <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
          <span
            className="text-sm font-black tracking-widest uppercase"
            style={{ color: 'rgba(180,130,0,0.6)' }}
          >
            FlexMath
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/leaderboard')}
              className="flex items-center gap-1.5 text-sm font-bold transition-colors"
              style={{ color: 'rgba(100,80,0,0.55)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#B45309')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(100,80,0,0.55)')}
            >
              🏆 리더보드
            </button>
            <MuteToggle />
          </div>
        </header>

        {/* ── 메인 ── */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 gap-12 max-w-3xl mx-auto w-full">

          {/* 로고 */}
          <Logo />

          {/* 카드 영역 */}
          <div
            className="w-full rounded-3xl p-8 flex flex-col gap-8"
            style={{
              background: 'rgba(255,255,255,0.70)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 8px 48px rgba(180,130,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
              border: '1.5px solid rgba(245,184,0,0.25)',
            }}
          >
            {/* 닉네임 */}
            <div className="flex flex-col items-center">
              <NicknameInput value={nickname} onChange={setNickname} />
            </div>

            {/* 구분 */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: 'rgba(180,130,0,0.15)' }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(180,130,0,0.5)' }}>
                난이도 선택
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(180,130,0,0.15)' }} />
            </div>

            {/* 난이도 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d, i) => (
                <motion.div
                  key={d}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                >
                  <DifficultyCard
                    difficulty={d}
                    selected={difficulty === d}
                    onSelect={v => { setDifficulty(v); play('click'); }}
                  />
                </motion.div>
              ))}
            </div>

            {/* 시작 버튼 */}
            <div className="flex flex-col items-center gap-3">
              <Button
                size="lg"
                onClick={handleStart}
                disabled={!canStart}
                pulse={canStart}
                className="min-w-[220px]"
              >
                🚀 모험 시작!
              </Button>

              <AnimatePresence>
                {!canStart && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-bold"
                    style={{ color: 'rgba(180,100,0,0.5)' }}
                  >
                    {!isNicknameValid ? '✏️ 이름을 먼저 입력해줘!' : '🗺 난이도를 선택해줘!'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* ── 푸터 ── */}
        <footer className="relative z-10 text-center py-5">
          <p className="text-xs font-semibold" style={{ color: 'rgba(120,90,0,0.35)' }}>
            © 2025 FlexMath · 어린이날 특별 체험
          </p>
        </footer>
      </div>
    </PageTransition>
  );
}
