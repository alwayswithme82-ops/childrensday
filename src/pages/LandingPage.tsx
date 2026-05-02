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

/* 배경 풍선·별 고정 데이터 */
const DECO = [
  { emoji: '🎈', cls: 'float-0', style: { top: '6%',  left: '4%',  fontSize: 40 } },
  { emoji: '🎈', cls: 'float-1', style: { top: '10%', right: '5%', fontSize: 36 } },
  { emoji: '⭐', cls: 'float-2', style: { top: '22%', left: '2%',  fontSize: 28 } },
  { emoji: '🌟', cls: 'float-3', style: { top: '18%', right: '3%', fontSize: 30 } },
  { emoji: '🎉', cls: 'float-4', style: { top: '40%', left: '1%',  fontSize: 32 } },
  { emoji: '🎊', cls: 'float-5', style: { top: '45%', right: '2%', fontSize: 30 } },
  { emoji: '🎈', cls: 'float-1', style: { top: '65%', left: '3%',  fontSize: 34 } },
  { emoji: '⭐', cls: 'float-0', style: { top: '70%', right: '4%', fontSize: 26 } },
  { emoji: '🌈', cls: 'float-3', style: { top: '82%', left: '5%',  fontSize: 32 } },
  { emoji: '🎈', cls: 'float-2', style: { top: '85%', right: '3%', fontSize: 38 } },
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
        className="relative min-h-screen flex flex-col items-center"
        style={{
          background: 'linear-gradient(180deg, #FFF9E6 0%, #FFFFFF 40%, #F0F9FF 100%)',
        }}
      >
        {/* ── 배경 장식 (고정 위치) ── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
          {DECO.map((d, i) => (
            <span key={i} className={`absolute select-none ${d.cls}`} style={d.style}>
              {d.emoji}
            </span>
          ))}
        </div>

        {/* ── 헤더 ── */}
        <header className="relative z-10 w-full max-w-2xl px-6 pt-5 pb-3 flex items-center justify-between">
          <span className="font-fredoka text-lg" style={{ color: '#FFD93D', WebkitTextStroke: '1px #e0b800' }}>
            FlexMath
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/leaderboard')}
              className="text-sm font-800 text-gray-400 hover:text-yellow-500 transition-colors"
            >
              🏆 리더보드
            </button>
            <MuteToggle />
          </div>
        </header>

        {/* ── 메인 콘텐츠 ── */}
        <main className="relative z-10 w-full max-w-2xl px-4 pb-12 flex flex-col items-center gap-8">

          {/* 로고 영역 */}
          <div className="w-full flex flex-col items-center pt-6 pb-2">
            <Logo />
          </div>

          {/* 폼 카드 */}
          <div
            className="w-full rounded-3xl p-6 md:p-8 flex flex-col gap-7"
            style={{
              background: '#fff',
              boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
              border: '2px solid #F3F4F6',
            }}
          >
            {/* STEP 1 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-900 text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#FF6B6B,#FFD93D)' }}
                >
                  1
                </span>
                <span className="font-900 text-gray-700 text-base">건축가 이름을 정해줘!</span>
              </div>
              <NicknameInput value={nickname} onChange={setNickname} />
            </div>

            {/* 구분선 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs font-800 text-gray-300 uppercase tracking-widest">다음</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* STEP 2 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-900 text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#4D96FF,#6BCB77)' }}
                >
                  2
                </span>
                <span className="font-900 text-gray-700 text-base">모험 난이도를 선택해줘!</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((d, i) => (
                  <motion.div
                    key={d}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
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

            {/* STEP 3 — CTA */}
            <div className="flex flex-col items-center gap-3 pt-1">
              <Button
                size="lg"
                onClick={handleStart}
                disabled={!canStart}
                pulse={canStart}
                className="w-full text-xl font-fredoka tracking-wide"
              >
                🚀 모험 시작!
              </Button>
              <AnimatePresence>
                {!canStart && (
                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-sm font-700 text-gray-400 text-center"
                  >
                    {!isNicknameValid
                      ? '✏️ 이름을 먼저 입력해줘!'
                      : '🗺️ 난이도를 선택해줘!'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* ── 푸터 ── */}
        <footer className="relative z-10 pb-6 text-center">
          <p className="text-xs font-600 text-gray-300">© 2025 FlexMath · 어린이날 특별 체험</p>
        </footer>
      </div>
    </PageTransition>
  );
}
