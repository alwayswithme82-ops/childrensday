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
import type { GameResult } from '../types/game';

const DUMMY_RESULT: GameResult = {
  nickname: '테스트왕',
  difficulty: 'medium',
  totalTimeSeconds: 127,
  totalStars: 14,
  maxStars: 18,
  grade: '건축사',
  scenes: [],
};

export function ResultPage() {
  const navigate = useNavigate();
  const { difficulty, sceneResults, reset, getGameResult } = useGameStore();
  const { play } = useSound();

  const hasRealData = !!(difficulty && sceneResults.length > 0);
  const result: GameResult = hasRealData ? getGameResult() : DUMMY_RESULT;

  useEffect(() => {
    if (!hasRealData) { navigate('/'); return; }
    saveScore(result);
    play('fanfare');
  }, []);

  const handleRetry = () => { reset(); navigate('/game'); };
  const handleOtherDifficulty = () => { reset(); navigate('/'); };
  const handleHome = () => { reset(); navigate('/'); };

  return (
    <PageTransition>
      <Confetti />

      <div
        className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1B2A4A 50%, #0F172A 100%)' }}
      >
        <TopBar />

        <div className="flex-1 flex flex-col items-center gap-8 px-4 py-10 overflow-y-auto">
          {/* 등급 표시 */}
          <GradeDisplay grade={result.grade} />

          {/* 점수 카드 */}
          <ScoreCard result={result} />

          {/* 인증서 */}
          <div className="w-full overflow-x-auto flex justify-center">
            <Certificate result={result} />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex flex-wrap gap-3 justify-center mt-2 pb-8">
            <Button onClick={() => navigate('/leaderboard')}>
              🏆 리더보드 등록
            </Button>
            <Button onClick={handleRetry} variant="outline">
              🔄 다시 도전
            </Button>
            <Button onClick={handleOtherDifficulty} variant="outline">
              🎮 다른 난이도
            </Button>
            <Button onClick={handleHome} variant="ghost">
              🏠 처음으로
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
