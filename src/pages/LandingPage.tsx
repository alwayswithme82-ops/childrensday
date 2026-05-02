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
      {/* ── 전체 래퍼: 흰 배경에 상단 amber gradient ── */}
      <div className="min-h-screen flex flex-col" style={{ background: '#ffffff' }}>

        {/* 상단 amber gradient 헤더 영역 */}
        <div
          className="w-full"
          style={{
            background: 'linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 60%, #ffffff 100%)',
            paddingBottom: '2rem',
          }}
        >
          {/* 헤더 */}
          <header className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
            <span className="text-sm font-800 text-amber-400 uppercase tracking-widest">FlexMath</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/leaderboard')}
                className="text-sm font-700 text-gray-400 hover:text-amber-500 transition-colors"
              >
                🏆 리더보드
              </button>
              <MuteToggle />
            </div>
          </header>

          {/* 로고 Hero */}
          <div className="max-w-4xl mx-auto px-6 pt-4 pb-8 flex flex-col items-center">
            <Logo />
          </div>
        </div>

        {/* ── 메인 폼 영역 ── */}
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 flex flex-col gap-8">

          {/* 섹션 1: 닉네임 */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-900 text-gray-800">
              1. 건축가 이름을 정해줘!
            </h2>
            <NicknameInput value={nickname} onChange={setNickname} />
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-100" />

          {/* 섹션 2: 난이도 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-900 text-gray-800">
              2. 난이도를 선택해줘!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d, i) => (
                <motion.div
                  key={d}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <DifficultyCard
                    difficulty={d}
                    selected={difficulty === d}
                    onSelect={v => { setDifficulty(v); play('click'); }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-100" />

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 pb-6">
            <Button
              size="lg"
              onClick={handleStart}
              disabled={!canStart}
              pulse={canStart}
              className="w-full sm:w-auto min-w-[240px] text-xl"
            >
              🚀 모험 시작!
            </Button>
            <AnimatePresence>
              {!canStart && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-sm font-700 text-gray-400"
                >
                  {!isNicknameValid ? '✏️ 이름을 먼저 입력해줘!' : '🗺️ 난이도를 선택해줘!'}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* 푸터 */}
        <footer className="border-t border-gray-100 py-5 text-center">
          <p className="text-xs font-600 text-gray-300">© 2025 FlexMath · 어린이날 특별 체험판</p>
        </footer>
      </div>
    </PageTransition>
  );
}
