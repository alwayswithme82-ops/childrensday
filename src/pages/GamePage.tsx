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
import { getLevelByDifficulty } from '../data/levels';
import { useTimer } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import { calcStars } from '../utils/helpers';

export function GamePage() {
  const navigate = useNavigate();
  const { difficulty, nickname, currentSceneIndex, sceneResults, hintsRemaining, nextScene, recordSceneResult, useHint } = useGameStore();
  const { elapsed, restart } = useTimer(false);
  const { play } = useSound();

  const [showStory, setShowStory] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsedThisScene, setHintsUsedThisScene] = useState(0);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (!difficulty || !nickname) { navigate('/'); return; }
  }, [difficulty, nickname, navigate]);

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
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg,#FFFDE7 0%,#FCE4EC 50%,#E3F2FD 100%)' }}>
        <GameHUD
          elapsed={elapsed}
          sceneIndex={currentSceneIndex}
          totalScenes={level.scenes.length}
          stars={totalStars}
          hintsRemaining={hintsRemaining}
          onHint={handleHint}
        />

        <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 relative">
          <div className="flex-1 min-h-[260px]">
            <CubeViewer cubes={scene.cubes} />
          </div>

          <div className="flex flex-col gap-4 md:w-80">
            <ProjectionView
              cubes={scene.cubes}
              faces={scene.projectionFaces ?? ['front']}
            />
            <div>
              <p className="text-sm font-700 mb-3" style={{ color: '#333' }}>{scene.questionText}</p>
              <OptionGrid
                options={scene.options}
                onAnswer={handleAnswer}
                disabled={showStory || answered}
              />
            </div>
          </div>

          <StoryOverlay
            text={scene.storyText}
            characterName={scene.characterName}
            visible={showStory}
            onDismiss={() => { setShowStory(false); restart(); }}
          />
        </div>

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
