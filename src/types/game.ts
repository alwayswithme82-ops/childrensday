export type Difficulty = 'easy' | 'medium' | 'hard';

export type CubeColorKey = 'red' | 'blue' | 'yellow' | 'green' | 'purple';

export interface CubeData {
  x: number;
  y: number;
  z: number;
  color: string;
}

export interface GridSize {
  x: number;
  y: number;
  z: number;
}

export type QuestionType =
  | 'building'
  | 'projection'
  | 'counting'
  | 'rotation'
  | 'matching'
  | 'missing'
  | 'netFolding'
  | 'symmetry'
  | 'surfaceArea'
  | 'composite';

export interface Option {
  id: string;
  label?: string;
  projectionData?: number[][];
  imageUrl?: string;
  correct: boolean;
}

export interface TargetProjections {
  front?: number[][];
  top?: number[][];
  side?: number[][];
}

export type ViewFace = 'front' | 'back' | 'top' | 'left';

export type ColorCell = string | null;

export type BuildRule =
  | { type: 'exactCubeCount'; count: number }
  | { type: 'requiredColorCount'; color: CubeColorKey; count: number }
  | { type: 'targetColorProjection'; face: ViewFace; grid: ColorCell[][] }
  | { type: 'targetShapeProjection'; face: ViewFace; grid: number[][] }
  | { type: 'colorMustBeHiddenFrom'; color: CubeColorKey; face: ViewFace }
  | { type: 'colorTouchCount'; colorA: CubeColorKey; colorB: CubeColorKey; count: number }
  | { type: 'visibleColorCount'; face: ViewFace; color: CubeColorKey; count: number }
  | { type: 'visibleBlockCountCompare'; faceA: ViewFace; faceB: ViewFace; relation: 'same' | 'different' };

export interface HintStage {
  text: string;
  grid?: { face: ViewFace; cells: ColorCell[][] };
}

export interface Scene {
  id: number;
  title?: string;
  storyText: string;
  characterName: string;
  cubes: CubeData[];
  questionType: QuestionType;
  mode?: 'build';
  targetProjections?: TargetProjections;
  maxCubes?: number;
  minCubes?: number;
  exactCubes?: number;
  allowedColors?: string[];
  requiredColorCount?: Partial<Record<CubeColorKey, number>>;
  maxGridSize?: GridSize;
  questionText: string;
  options: Option[];
  hintText: string;
  successText?: string;
  projectionFaces?: ('front' | 'side' | 'top')[];
  // 큐브왕의 메모: 미션 카드 상단에 양피지처럼 표시되는 문구
  memo?: string;
  // 새 규칙 기반 검증
  rules?: BuildRule[];
  // 단계별 힌트 (텍스트 + 선택적 색깔 격자)
  hintStages?: HintStage[];
}

export interface Level {
  difficulty: Difficulty;
  name: string;
  description: string;
  scenes: Scene[];
}

export interface SceneResult {
  sceneId: number;
  correct: boolean;
  attempts: number;
  timeSeconds: number;
  hintsUsed: number;
  stars: 1 | 2 | 3;
}

export type Grade = '견습생' | '건축사' | '큐브왕';

export interface GameResult {
  difficulty: Difficulty;
  nickname: string;
  totalTimeSeconds: number;
  totalStars: number;
  maxStars: number;
  grade: Grade;
  scenes: SceneResult[];
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  difficulty: Difficulty;
  stars: number;
  maxStars: number;
  clearTime: number;
  grade: Grade;
  hintsUsed: number;
  createdAt: number;
}

export interface GameState {
  difficulty: Difficulty | null;
  nickname: string;
  currentSceneIndex: number;
  sceneResults: SceneResult[];
  hintsRemaining: number;
  isPlaying: boolean;
  startGame: (difficulty: Difficulty, nickname: string) => void;
  nextScene: () => void;
  recordSceneResult: (result: SceneResult) => void;
  useHint: () => void;
  reset: () => void;
  getGameResult: () => GameResult;
}

export interface SoundState {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (v: number) => void;
}
