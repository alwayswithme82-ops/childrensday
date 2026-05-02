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

/* ── 배경 파티클 데이터 ── */
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  startY: 80 + Math.random() * 20,
  emoji: ['✨','⭐','🌟','💫','✦'][Math.floor(Math.random() * 5)],
  size: 10 + Math.random() * 14,
  dur: 3 + Math.random() * 4,
  delay: Math.random() * 5,
}));

const CLOUDS = [
  { x: 5,  y: 12, scale: 1.2, delay: 0 },
  { x: 75, y: 8,  scale: 0.9, delay: 1.5 },
  { x: 40, y: 18, scale: 0.7, delay: 3 },
  { x: 88, y: 20, scale: 1.0, delay: 0.8 },
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
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #3D1A7A 0%, #2D1454 30%, #1A0A3C 60%, #110726 100%)',
        }}
      >

        {/* ── 상단 오로라 효과 ── */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(ellipse, #FFD700 0%, #FF8C00 40%, transparent 70%)' }}
          />
          <div
            className="absolute top-1/3 -left-32 w-64 h-64 rounded-full opacity-20 blur-2xl"
            style={{ background: '#C084FC' }}
          />
          <div
            className="absolute top-1/3 -right-32 w-64 h-64 rounded-full opacity-20 blur-2xl"
            style={{ background: '#38BDF8' }}
          />
          {/* 하단 반짝임 */}
          <div
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-48 rounded-full opacity-15 blur-3xl"
            style={{ background: '#FFD700' }}
          />
        </div>

        {/* ── 구름 ── */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {CLOUDS.map((c, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-10"
              style={{ left: `${c.x}%`, top: `${c.y}%`, scale: c.scale }}
              animate={{ x: [0, 20, 0] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, delay: c.delay, ease: 'easeInOut' }}
            >
              ☁️
            </motion.div>
          ))}
        </div>

        {/* ── 파티클 ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {PARTICLES.map(p => (
            <motion.span
              key={p.id}
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.startY}%`,
                fontSize: p.size,
              }}
              animate={{ y: [0, -120], opacity: [0, 1, 0] }}
              transition={{
                duration: p.dur,
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeOut',
              }}
            >
              {p.emoji}
            </motion.span>
          ))}
        </div>

        {/* ── 음소거 ── */}
        <div className="absolute top-4 right-4 z-20">
          <MuteToggle />
        </div>

        {/* ════════════════════════════════
            메인 콘텐츠
        ════════════════════════════════ */}
        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl px-4 py-12">

          {/* 로고 */}
          <Logo />

          {/* 구분선 */}
          <div className="w-full max-w-xs flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,215,0,0.4))' }} />
            <span className="text-lg">🔮</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(255,215,0,0.4))' }} />
          </div>

          {/* 닉네임 */}
          <NicknameInput value={nickname} onChange={setNickname} />

          {/* 난이도 선택 */}
          <div className="w-full">
            <motion.p
              className="text-center text-sm font-bold mb-5"
              style={{ color: '#FDE68A' }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✦ 모험 난이도를 선택해줘 ✦
            </motion.p>
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

          {/* 시작 버튼 */}
          <div className="flex flex-col items-center gap-3">
            <Button
              size="lg"
              onClick={handleStart}
              disabled={!canStart}
              pulse={canStart}
              className="w-full max-w-xs text-xl"
            >
              🚀 모험 시작!
            </Button>

            {!canStart && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-medium"
                style={{ color: 'rgba(253,230,138,0.5)' }}
              >
                {!isNicknameValid ? '✏️ 이름을 먼저 입력해줘!' : '🗺 난이도를 선택해줘!'}
              </motion.p>
            )}
          </div>
        </div>

        {/* ── 리더보드 링크 (우하단) ── */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/leaderboard')}
          className="absolute bottom-6 right-6 z-10 flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-all"
          style={{
            background: 'rgba(255,215,0,0.12)',
            color: 'rgba(253,230,138,0.8)',
            border: '1px solid rgba(255,215,0,0.25)',
          }}
        >
          🏆 리더보드
        </motion.button>

        {/* ── 바닥 성 장식 ── */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none opacity-8 text-8xl select-none" aria-hidden>
          🏰
        </div>
      </div>
    </PageTransition>
  );
}
