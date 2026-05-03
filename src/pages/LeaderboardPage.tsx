import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { TopBar } from '../components/layout/TopBar';
import { DifficultyTabs } from '../components/leaderboard/DifficultyTabs';
import { RankTable } from '../components/leaderboard/RankTable';
import { Button } from '../components/shared/Button';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useGameStore } from '../stores/useGameStore';
import type { Difficulty, LeaderboardEntry } from '../types/game';

const now = Date.now();
const h = (n: number) => now - 1000 * 3600 * n;

const DUMMY_ENTRIES: LeaderboardEntry[] = [
  { id: 'd01', nickname: '큐브왕자', difficulty: 'medium', stars: 18, maxStars: 18, clearTime: 89,  grade: '큐브왕', hintsUsed: 0, createdAt: h(1) },
  { id: 'd02', nickname: '별다섯',   difficulty: 'medium', stars: 16, maxStars: 18, clearTime: 103, grade: '큐브왕', hintsUsed: 1, createdAt: h(3) },
  { id: 'd03', nickname: '공간천재', difficulty: 'medium', stars: 15, maxStars: 18, clearTime: 117, grade: '건축사', hintsUsed: 0, createdAt: h(5) },
  { id: 'd04', nickname: '도형박사', difficulty: 'medium', stars: 14, maxStars: 18, clearTime: 128, grade: '건축사', hintsUsed: 2, createdAt: h(8) },
  { id: 'd05', nickname: '테스트왕', difficulty: 'medium', stars: 14, maxStars: 18, clearTime: 135, grade: '건축사', hintsUsed: 1, createdAt: h(12) },
  { id: 'd06', nickname: '큐브짱',   difficulty: 'medium', stars: 12, maxStars: 18, clearTime: 149, grade: '건축사', hintsUsed: 3, createdAt: h(18) },
  { id: 'd07', nickname: '입체눈',   difficulty: 'medium', stars: 11, maxStars: 18, clearTime: 162, grade: '건축사', hintsUsed: 2, createdAt: h(24) },
  { id: 'd08', nickname: '꿈나무',   difficulty: 'medium', stars: 9,  maxStars: 18, clearTime: 178, grade: '견습생', hintsUsed: 4, createdAt: h(30) },
  { id: 'd09', nickname: '처음이야', difficulty: 'medium', stars: 7,  maxStars: 18, clearTime: 195, grade: '견습생', hintsUsed: 5, createdAt: h(48) },
  { id: 'd10', nickname: '파이팅',   difficulty: 'medium', stars: 6,  maxStars: 18, clearTime: 213, grade: '견습생', hintsUsed: 6, createdAt: h(72) },
];

export function LeaderboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Difficulty>('medium');
  const realEntries = useLeaderboard(tab);
  const { nickname } = useGameStore();

  const entries = realEntries.length > 0 ? realEntries : DUMMY_ENTRIES;

  return (
    <PageTransition>
      <div
        className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1B2A4A 50%, #0F172A 100%)' }}
      >
        <TopBar />

        <div className="flex-1 flex flex-col gap-6 px-4 py-8 max-w-3xl mx-auto w-full">
          {/* 헤더 */}
          <div className="text-center">
            <h1 className="font-fredoka text-4xl text-gold">🏆 리더보드</h1>
            <p className="text-sm text-white/40 mt-1">나의 실력을 겨뤄보세요!</p>
          </div>

          {/* 난이도 탭 */}
          <DifficultyTabs active={tab} onChange={setTab} />

          {/* 순위 테이블 */}
          <RankTable entries={entries} myNickname={nickname} />

          {/* 하단 버튼 */}
          <div className="flex justify-center pt-2 pb-4">
            <Button onClick={() => navigate('/')} size="lg">
              🎮 게임하러 가기
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
