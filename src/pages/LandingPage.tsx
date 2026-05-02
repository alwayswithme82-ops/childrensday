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

/* 별빛 배경 */
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  dur: 1.5 + Math.random() * 2,
  delay: Math.random() * 2,
  size: Math.random() < 0.3 ? 'text-base' : 'text-xs',
}));

export function LandingPage() {
  const [nickname, setNickname] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const { startGame } = useGameStore();
  const navigate = useNavigate();
  const { play } = useSound();

  const isNicknameValid = nickname.trim().length >= 1;
  const canStart = isNicknameValid && difficulty !== null;

  const handleStart = () => {
    if (!canStart || !difficulty) return;
    play('click');
    startGame(difficulty, nickname.trim());
    navigate('/game');
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-[#0F172A] flex flex-col items-center justify-center overflow-hidden">

        {/* ── 별빛 배경 ── */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {STARS.map(s => (
            <motion.span
              key={s.id}
              className={`absolute ${s.size} text-gold/40`}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.4, 1] }}
              transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
            >
              ✦
            </motion.span>
          ))}
          {/* 배경 glow orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl" />
        </div>

        {/* ── 음소거 토글 ── */}
        <div className="absolute top-4 right-4 z-10">
          <MuteToggle />
        </div>

        {/* ── 메인 콘텐츠 ── */}
        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl px-4 py-12">

          {/* 로고 */}
          <Logo />

          {/* 닉네임 입력 */}
          <NicknameInput value={nickname} onChange={setNickname} />

          {/* 난이도 선택 */}
          <div className="w-full">
            <p className="text-slate-500 text-sm text-center mb-4 tracking-wide">
              ✦ 난이도를 선택해줘 ✦
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

          {/* 시작 버튼 */}
          <Button
            size="lg"
            onClick={handleStart}
            disabled={!canStart}
            pulse={canStart}
            className="w-full max-w-xs"
          >
            🚀 모험 시작!
          </Button>

          {/* 힌트 텍스트 */}
          {!isNicknameValid && (
            <p className="text-slate-600 text-xs">이름을 입력하고 난이도를 선택하면 시작할 수 있어!</p>
          )}
        </div>

        {/* ── 리더보드 링크 (우하단) ── */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/leaderboard')}
          className="absolute bottom-6 right-6 text-slate-500 hover:text-gold text-sm transition-colors flex items-center gap-1"
        >
          🏆 리더보드
        </motion.button>
      </div>
    </PageTransition>
  );
}
