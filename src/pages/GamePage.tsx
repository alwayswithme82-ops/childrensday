import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { GameHUD } from '../components/game/GameHUD';
import { CubeViewer } from '../components/game/CubeViewer';
import { ProjectionView } from '../components/game/ProjectionView';
import { OptionGrid } from '../components/game/OptionGrid';
import { StoryOverlay } from '../components/game/StoryOverlay';
import { HintModal } from '../components/game/HintModal';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { getLevelByDifficulty } from '../data/levels';
import { useTimer } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import { calcStars } from '../utils/helpers';

export function GamePage() {
  const navigate = useNavigate();
  const { difficulty, currentSceneIndex, sceneResults, hintsRemaining, nextScene, recordSceneResult, useHint } = useGameStore();
  const { isAuthenticated } = useAuthStore();
  const { elapsed, restart } = useTimer(false);
  const { play } = useSound();

  const [showStory, setShowStory] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsedThisScene, setHintsUsedThisScene] = useState(0);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    if (!difficulty) { navigate('/'); return; }
  }, [isAuthenticated, difficulty, navigate]);

  useEffect(() => {
    setShowStory(true);
    setAttempts(0);
    setHintsUsedThisScene(0);
    setAnswered(false);
    restart();
  }, [currentSceneIndex]);

  if (!difficulty) return null;

  const level = getLevelByDifficulty(difficulty);
  const scene = level.scenes[currentSceneIndex];
  if (!scene) return null;

  const totalStars = sceneResults.reduce((s, r) => s + r.stars, 0);

  const handleAnswer = (correct: boolean) => {
    if (answered) return;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (correct) {
      play('correct');
      setAnswered(true);
      const stars = calcStars(newAttempts, hintsUsedThisScene);
      const timeSeconds = elapsed - sceneElapsed;

      setTimeout(() => {
        recordSceneResult({ sceneId: scene.id, correct: true, attempts: newAttempts, timeSeconds, hintsUsed: hintsUsedThisScene, stars });
        if (currentSceneIndex + 1 >= level.scenes.length) {
          navigate('/result');
        } else {
          setSceneElapsed(elapsed);
          nextScene();
        }
      }, 1000);
    } else {
      play('wrong');
    }
  };

  const handleHint = () => {
    if (hintsRemaining <= 0) return;
    play('click');
    useHint();
    setHintsUsedThisScene(h => h + 1);
    setShowHint(true);
  };

  return (
    <PageTransition>
      <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
        {/* 상단 HUD: h-16 */}
        <GameHUD
          elapsed={elapsed}
          sceneIndex={currentSceneIndex}
          totalScenes={level.scenes.length}
          stars={totalStars}
          hintsRemaining={hintsRemaining}
          onHint={handleHint}
        />

        {/* 메인 영역: h-[calc(100vh-4rem)] */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* 좌측 w-[60%]: CubeViewer */}
          <div className="flex-1 md:flex-none md:w-[60%] flex flex-col p-4 gap-3 min-h-[260px] md:min-h-0">
            <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden relative">
              <CubeViewer cubes={scene.cubes} />
            </div>
            <p className="text-sm text-slate-500 text-center select-none">마우스 드래그로 회전해보세요 🔄</p>
          </div>

          {/* 우측 w-[40%]: 투영 + 문제 + 선택지 */}
          <div className="md:w-[40%] p-6 flex flex-col gap-6 overflow-y-auto">
            <ProjectionView
              cubes={scene.cubes}
              faces={scene.projectionFaces ?? ['front']}
            />

            <p className="text-lg text-white font-medium leading-snug">{scene.questionText}</p>

            <OptionGrid
              options={scene.options}
              onAnswer={handleAnswer}
              disabled={showStory || answered}
            />
          </div>
        </div>

        {/* 스토리 오버레이: fixed bottom-0 */}
        <StoryOverlay
          text={scene.storyText}
          characterName={scene.characterName}
          visible={showStory}
          onDismiss={() => { setShowStory(false); restart(); }}
        />

        {/* 힌트 모달 */}
        <HintModal
          open={showHint}
          onClose={() => setShowHint(false)}
          hintText={scene.hintText}
          hintsRemaining={hintsRemaining}
        />
      </div>
    </PageTransition>
  );
}
