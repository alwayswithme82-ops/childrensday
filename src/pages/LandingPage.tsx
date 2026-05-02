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

export function LandingPage() {
  const [nickname, setNickname] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const { startGame } = useGameStore();
  const navigate = useNavigate();
  const { play } = useSound();

  const canStart = nickname.trim().length >= 1 && difficulty !== null;

  const handleStart = () => {
    if (!canStart || !difficulty) return;
    play('click');
    startGame(difficulty, nickname.trim());
    navigate('/game');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-between px-4 py-8">
        <div className="absolute top-4 right-4">
          <MuteToggle />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-10 w-full max-w-lg">
          <Logo />

          <div className="flex flex-col items-center gap-8 w-full">
            <NicknameInput value={nickname} onChange={setNickname} />

            <div>
              <p className="text-white/50 text-sm text-center mb-4">난이도를 선택하세요</p>
              <div className="flex gap-4 flex-wrap justify-center">
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

            <motion.div
              animate={canStart ? { scale: [1, 1.03, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Button
                size="lg"
                onClick={handleStart}
                disabled={!canStart}
                className="text-xl px-12"
              >
                🚀 모험 시작!
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => navigate('/leaderboard')}
            className="text-white/40 hover:text-white/80 text-sm transition-colors flex items-center gap-1"
          >
            🏆 리더보드
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
