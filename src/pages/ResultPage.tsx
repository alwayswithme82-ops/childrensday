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
    saveScore(getGameResult());
    play('fanfare');
  }, []);

  if (!difficulty || sceneResults.length === 0) return null;
  const result = getGameResult();

  return (
    <PageTransition>
      <Confetti />
      <div className="min-h-screen bg-white flex flex-col">
        <TopBar />
        <div className="flex-1 flex flex-col items-center gap-8 px-4 py-10 max-w-lg mx-auto w-full">
          <GradeDisplay grade={result.grade} />
          <ScoreCard result={result} />
          <Certificate result={result} />
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/leaderboard')}>🏆 리더보드</Button>
            <Button variant="outline" onClick={() => { reset(); navigate('/'); }}>🔄 다시 도전</Button>
            <Button onClick={() => { reset(); navigate('/'); }}>🏠 처음으로</Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
