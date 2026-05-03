import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { TopBar } from '../components/layout/TopBar';
import { Confetti } from '../components/result/Confetti';
import { GradeDisplay } from '../components/result/GradeDisplay';
import { ScoreCard } from '../components/result/ScoreCard';
import { Certificate } from '../components/result/Certificate';
import { Button } from '../components/shared/Button';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { saveScore } from '../services/score.service';
import { useSound } from '../hooks/useSound';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const SUBMIT_KEY = 'scoreSubmitted';

export function ResultPage() {
  const navigate = useNavigate();
  const { difficulty, sceneResults, reset, getGameResult } = useGameStore();
  const { uid } = useAuthStore();
  const { playFanfare } = useSound();
  const isOnline = useOnlineStatus();
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const fanfarePlayed = useRef(false);

  const hasRealData = !!(difficulty && sceneResults.length > 0);

  useEffect(() => {
    if (!hasRealData) { navigate('/'); return; }
    if (!fanfarePlayed.current) {
      fanfarePlayed.current = true;
      playFanfare();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasRealData) return null;

  const result = getGameResult();
  const alreadySubmitted = sessionStorage.getItem(SUBMIT_KEY) === result.difficulty;

  const handleSubmit = async () => {
    if (!isOnline || submitState !== 'idle' || alreadySubmitted) return;
    setSubmitState('loading');
    try {
      await saveScore(uid ?? 'anon', result);
      sessionStorage.setItem(SUBMIT_KEY, result.difficulty);
      setSubmitState('done');
    } catch {
      setSubmitState('error');
    }
  };

  const handleRetry = () => {
    reset();
    navigate(`/game?difficulty=${result.difficulty}`);
  };

  const handleOtherDifficulty = () => { reset(); navigate('/'); };

  return (
    <PageTransition>
      <Confetti />

      <div
        className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1B2A4A 50%, #0F172A 100%)' }}
      >
        <TopBar />

        <div className="flex-1 flex flex-col items-center gap-6 sm:gap-8 px-4 py-8 sm:py-10 overflow-y-auto overflow-x-hidden">
          <GradeDisplay grade={result.grade} />
          <ScoreCard result={result} />

          <div className="w-full max-w-full overflow-x-auto flex justify-start sm:justify-center pb-2">
            <Certificate result={result} />
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-2 pb-8">
            {/* 리더보드 등록 버튼 */}
            {!alreadySubmitted && submitState !== 'done' && (
              <Button
                onClick={handleSubmit}
                disabled={!isOnline || submitState === 'loading'}
              >
                {!isOnline ? '인터넷 연결 필요' :
                 submitState === 'loading' ? '등록 중...' :
                 submitState === 'error' ? '❌ 다시 시도' :
                 '🏆 리더보드 등록'}
              </Button>
            )}
            {(alreadySubmitted || submitState === 'done') && (
              <Button onClick={() => navigate('/leaderboard')} variant="outline">
                🏆 리더보드 보기
              </Button>
            )}
            {submitState === 'error' && (
              <p className="w-full text-center text-sm text-red-400">
                네트워크 오류, 다시 시도해주세요
              </p>
            )}
            {!isOnline && !alreadySubmitted && submitState !== 'done' && (
              <p className="w-full text-center text-sm text-amber-300">
                오프라인에서는 게임 결과 확인만 가능해요.
              </p>
            )}

            <Button onClick={handleRetry} variant="outline">🔄 다시 도전</Button>
            <Button onClick={handleOtherDifficulty} variant="outline">🎮 다른 난이도</Button>
            <Button onClick={handleOtherDifficulty} variant="ghost">🏠 처음으로</Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
