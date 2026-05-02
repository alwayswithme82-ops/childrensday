import { create } from 'zustand';
import type { Difficulty, GameResult, GameState, SceneResult } from '../types/game';
import { calcGrade } from '../utils/helpers';
import { getLevelByDifficulty } from '../data/levels';
import { DIFFICULTY_CONFIG } from '../utils/constants';

export const useGameStore = create<GameState>((set, get) => ({
  difficulty: null,
  nickname: '',
  currentSceneIndex: 0,
  sceneResults: [],
  hintsRemaining: 0,
  isPlaying: false,

  startGame: (difficulty: Difficulty, nickname: string) => {
    set({
      difficulty,
      nickname,
      currentSceneIndex: 0,
      sceneResults: [],
      hintsRemaining: DIFFICULTY_CONFIG[difficulty].hints,
      isPlaying: true,
    });
  },

  nextScene: () => {
    set(state => ({ currentSceneIndex: state.currentSceneIndex + 1 }));
  },

  recordSceneResult: (result: SceneResult) => {
    set(state => ({ sceneResults: [...state.sceneResults, result] }));
  },

  useHint: () => {
    set(state => ({
      hintsRemaining: Math.max(0, state.hintsRemaining - 1),
    }));
  },

  reset: () => {
    set({
      difficulty: null,
      nickname: '',
      currentSceneIndex: 0,
      sceneResults: [],
      hintsRemaining: 0,
      isPlaying: false,
    });
  },

  getGameResult: (): GameResult => {
    const { difficulty, nickname, sceneResults } = get();
    const d = difficulty ?? 'easy';
    const level = getLevelByDifficulty(d);
    const maxStars = level.scenes.length * 3;
    const totalStars = sceneResults.reduce((sum, r) => sum + r.stars, 0);
    const totalTimeSeconds = sceneResults.reduce((sum, r) => sum + r.timeSeconds, 0);
    const grade = calcGrade(totalStars, maxStars);

    return {
      difficulty: d,
      nickname,
      totalTimeSeconds,
      totalStars,
      maxStars,
      grade,
      scenes: sceneResults,
    };
  },
}));
