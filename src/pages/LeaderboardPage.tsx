import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { TopBar } from '../components/layout/TopBar';
import { DifficultyTabs } from '../components/leaderboard/DifficultyTabs';
import { RankTable } from '../components/leaderboard/RankTable';
import { Loading } from '../components/shared/Loading';
import { Button } from '../components/shared/Button';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useGameStore } from '../stores/useGameStore';
import type { Difficulty } from '../types/game';

export function LeaderboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Difficulty>('medium');
  const { scores, loading, error, refetch } = useLeaderboard(tab);
  const { nickname } = useGameStore();

  return (
    <PageTransition>
      <div
        className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1B2A4A 50%, #0F172A 100%)' }}
      >
        <TopBar />

        <div className="flex-1 flex flex-col gap-6 px-4 py-8 max-w-3xl mx-auto w-full">
          <div className="text-center">
            <h1 className="font-fredoka text-4xl text-gold">🏆 리더보드</h1>
            <p className="text-sm text-white/40 mt-1">나의 실력을 겨뤄보세요!</p>
          </div>

          <DifficultyTabs active={tab} onChange={setTab} />

          {loading && (
            <div className="flex justify-center py-16">
              <Loading />
            </div>
          )}

          {!loading && error && (
            <div className="py-16 text-center flex flex-col items-center gap-4">
              <p className="text-5xl">😢</p>
              <p className="text-white/50">{error}</p>
              <Button onClick={refetch} variant="outline">🔄 다시 시도</Button>
            </div>
          )}

          {!loading && !error && scores.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-5xl mb-4">🏗</p>
              <p className="font-fredoka text-xl text-white/50">아직 기록이 없어요!</p>
              <p className="text-sm text-white/30 mt-1">첫 번째 도전자가 되어보세요!</p>
            </div>
          )}

          {!loading && !error && scores.length > 0 && (
            <RankTable entries={scores} myNickname={nickname} />
          )}

          <div className="flex justify-center pt-2 pb-4">
            <Button onClick={() => navigate('/')} size="lg">🎮 게임하러 가기</Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
