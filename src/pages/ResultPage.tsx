import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { TopBar } from '../components/layout/TopBar';
import { Confetti } from '../components/result/Confetti';
import { GradeDisplay } from '../components/result/GradeDisplay';
import { ScoreCard } from '../components/result/ScoreCard';
import { Certificate } from '../components/result/Certificate';
import { Button } from '../components/shared/Button';
import { useGameStore } from '../stores/useGameStore';
import { saveScore } from '../services/leaderboard.service';
import { useSound } from '../hooks/useSound';

export function ResultPage() {
  const navigate = useNavigate();
  const { difficulty, sceneResults, reset, getGameResult } = useGameStore();
  const { play } = useSound();

  useEffect(() => {
    if (!difficulty || sceneResults.length === 0) { navigate('/'); return; }
    const result = getGameResult();
    saveScore(result);
    play('fanfare');
  }, []);

  if (!difficulty || sceneResults.length === 0) return null;
  const result = getGameResult();

  const handleRetry = () => { reset(); navigate('/game'); };
  const handleHome = () => { reset(); navigate('/'); };

  return (
    <PageTransition>
      <Confetti />
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <TopBar />
        <div className="flex-1 flex flex-col items-center gap-6 px-4 py-8 overflow-y-auto">
          <GradeDisplay grade={result.grade} />
          <ScoreCard result={result} />
          <Certificate result={result} />
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Button onClick={() => navigate('/leaderboard')} variant="outline">🏆 리더보드</Button>
            <Button onClick={handleRetry} variant="outline">🔄 다시 도전</Button>
            <Button onClick={handleHome}>🏠 처음으로</Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
