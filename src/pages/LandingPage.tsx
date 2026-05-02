import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../components/landing/Logo';
import { NicknameInput } from '../components/landing/NicknameInput';
import { DifficultyCard } from '../components/landing/DifficultyCard';
import { Button } from '../components/shared/Button';
import { MuteToggle } from '../components/shared/MuteToggle';
import { PageTransition } from '../components/layout/PageTransition';
import { useGameStore } from '../stores/useGameStore';
import { useSound } from '../hooks/useSound';
import type { Difficulty } from '../types/game';

/* 정적 별 데이터 — 매 렌더마다 재생성 방지 */
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() < 0.2 ? 2 : 1,
  delay: Math.random() * 4,
  dur: 2 + Math.random() * 3,
}));

/* 상승 파티클 */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 5 + Math.random() * 90,
  dur: 4 + Math.random() * 5,
  delay: Math.random() * 8,
  glyph: ['✦', '✧', '·', '✦', '·'][i % 5],
  size: 8 + Math.random() * 8,
}));

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
      {/* ════ 전체 래퍼 ════ */}
      <div
        className="relative min-h-screen flex flex-col overflow-x-hidden"
        style={{ background: '#09090F' }}
      >

        {/* ── 배경 레이어 ── */}
        <div className="pointer-events-none fixed inset-0" aria-hidden>

          {/* 중앙 상단 황금 glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px]"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(245,184,0,0.18) 0%, rgba(245,184,0,0.04) 50%, transparent 80%)',
            }}
          />

          {/* 별 필드 */}
          {STARS.map(s => (
            <motion.div
              key={s.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
              }}
              animate={{ opacity: [0.1, 0.6, 0.1] }}
              transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
            />
          ))}

          {/* 상승 파티클 */}
          {PARTICLES.map(p => (
            <motion.span
              key={p.id}
              className="absolute font-black"
              style={{
                left: `${p.x}%`,
                bottom: 0,
                fontSize: p.size,
                color: 'rgba(245,184,0,0.35)',
              }}
              animate={{ y: [0, -200], opacity: [0, 0.8, 0] }}
              transition={{
                duration: p.dur,
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeOut',
              }}
            >
              {p.glyph}
            </motion.span>
          ))}

          {/* 좌우 subtle accent */}
          <div
            className="absolute left-0 top-1/3 w-64 h-64 -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: 'rgba(59,130,246,0.06)' }}
          />
          <div
            className="absolute right-0 top-2/3 w-48 h-48 translate-x-1/3 rounded-full blur-3xl"
            style={{ background: 'rgba(168,85,247,0.06)' }}
          />
        </div>

        {/* ── 헤더 ── */}
        <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
          <div
            className="text-sm font-black tracking-widest uppercase"
            style={{ color: 'rgba(245,184,0,0.5)' }}
          >
            FlexMath
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/leaderboard')}
              className="flex items-center gap-1.5 text-sm font-bold transition-colors"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,184,0,0.9)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
            >
              🏆 리더보드
            </button>
            <MuteToggle />
          </div>
        </header>

        {/* ── 메인 콘텐츠 ── */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10 gap-14 max-w-3xl mx-auto w-full">

          {/* 로고 */}
          <Logo />

          {/* 입력 + 선택 섹션 */}
          <div className="w-full flex flex-col gap-8">

            {/* 닉네임 */}
            <div className="flex flex-col items-center">
              <NicknameInput value={nickname} onChange={setNickname} />
            </div>

            {/* 구분선 */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(245,184,0,0.45)' }}>
                난이도 선택
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* 난이도 카드 3개 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d, i) => (
                <motion.div
                  key={d}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                >
                  <DifficultyCard
                    difficulty={d}
                    selected={difficulty === d}
                    onSelect={d => { setDifficulty(d); play('click'); }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA 버튼 */}
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
                  style={{ color: 'rgba(245,184,0,0.45)' }}
                >
                  {!isNicknameValid ? '이름을 먼저 입력해줘!' : '난이도를 선택해줘!'}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* ── 푸터 ── */}
        <footer className="relative z-10 text-center py-6">
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © 2025 FlexMath · 어린이날 특별 체험
          </p>
        </footer>
      </div>
    </PageTransition>
  );
}

/* AnimatePresence import 추가 */
import { AnimatePresence } from 'framer-motion';
