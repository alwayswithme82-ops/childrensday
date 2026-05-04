import type { Difficulty, HintStage, Level, Scene } from '../types/game';
import { CUBE_COLOR_HEX } from '../utils/constants';
import { validateBuildMission } from '../utils/buildValidation';

const R = CUBE_COLOR_HEX.red;
const B = CUBE_COLOR_HEX.blue;
const G = CUBE_COLOR_HEX.green;
const Y = CUBE_COLOR_HEX.yellow;
const _ = null;

// ──────────────────────────────────────────────────────────────────────
// Mission 1 — 무지개 문 만들기
// 빨강 1, 파랑 2 / 앞에서 본 그림 맞추기
// ──────────────────────────────────────────────────────────────────────
const MISSION_1: Scene = {
  id: 1,
  title: '무지개 문 만들기',
  characterName: '루비',
  storyText:
    '루비가 말했어요.\n“우와! 무지개 문이 망가졌어.\n빨강 큐브와 파랑 큐브로\n문을 다시 만들어줘!”',
  memo: '“앞에서 봤을 때\n그림과 똑같이 만들어주세요.”',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '앞에서 본 그림과 똑같이 큐브를 쌓아 무지개 문을 만들어보세요.',
  rules: [
    { type: 'exactCubeCount', count: 3 },
    { type: 'requiredColorCount', color: 'red',  count: 1 },
    { type: 'requiredColorCount', color: 'blue', count: 2 },
    {
      type: 'targetColorProjection',
      face: 'front',
      grid: [
        [_, B],
        [R, B],
      ],
    },
  ],
  requiredColorCount: { red: 1, blue: 2 },
  maxCubes: 3,
  exactCubes: 3,
  maxGridSize: { x: 3, y: 3, z: 2 },
  successText: '철컥!\n무지개 문이 활짝 열렸어요! 🌈',
  hintText: '왼쪽 아래에 빨강, 오른쪽에는 파랑 두 개를 세로로 쌓아요.',
  hintStages: [
    { text: '앞에서 본 그림과 똑같이 만들어 봐요. 빨강 1개, 파랑 2개를 쓰세요.' },
    {
      text: '왼쪽 아래에는 빨강, 오른쪽에는 파랑을 세로로 두 개 쌓아요.',
      grid: {
        face: 'front',
        cells: [
          [_, B],
          [R, B],
        ] as (string | null)[][],
      },
    },
  ],
  // 앞에서 보면 (0,0) 빨강, (1,0)·(1,1) 파랑 → 그림과 일치.
  officialSolution: [
    { x: 0, y: 0, z: 0, color: R },
    { x: 1, y: 0, z: 0, color: B },
    { x: 1, y: 1, z: 0, color: B },
  ],
};

// ──────────────────────────────────────────────────────────────────────
// Mission 2 — 숨바꼭질 노랑 큐브
// 빨강 1, 파랑 1, 노랑 1 / 노랑은 앞에서 안 보이게
// ──────────────────────────────────────────────────────────────────────
const MISSION_2: Scene = {
  id: 2,
  title: '숨바꼭질 노랑 큐브',
  characterName: '노랑 큐브',
  storyText:
    '노랑 큐브가 말했어요.\n“나는 부끄러워서\n앞에서는 안 보이고 싶어!”\n노랑 큐브를 빨강 큐브 뒤에\n살짝 숨겨주세요.',
  memo:
    '“노랑 큐브를 꼭 사용해야 해.\n하지만 앞에서 보면\n노랑 큐브가 보이면 안 돼!”',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '노랑 큐브를 빨강 큐브 뒤에 숨겨, 앞에서는 빨강과 파랑만 보이게 만들어주세요.',
  rules: [
    { type: 'exactCubeCount', count: 3 },
    { type: 'requiredColorCount', color: 'red',    count: 1 },
    { type: 'requiredColorCount', color: 'blue',   count: 1 },
    { type: 'requiredColorCount', color: 'yellow', count: 1 },
    { type: 'colorMustBeHiddenFrom', color: 'yellow', face: 'front' },
    {
      type: 'targetColorProjection',
      face: 'front',
      grid: [[R, B]],
    },
  ],
  requiredColorCount: { red: 1, blue: 1, yellow: 1 },
  maxCubes: 3,
  exactCubes: 3,
  maxGridSize: { x: 3, y: 2, z: 3 },
  successText: '찾았다!\n아니, 잘 숨었다! 🫣\n노랑 큐브가 방긋 웃었어요.',
  hintText: '노랑은 빨강 큐브 바로 뒤에 숨기면 앞에서는 안 보여요.',
  hintStages: [
    { text: '앞에서 보면 빨강·파랑만 보여야 해요. 노랑은 다른 큐브 뒤에 숨기세요.' },
    {
      text: '위에서 보면 앞줄은 빨강·파랑, 뒷줄에 노랑이 살짝 숨어 있어요.',
      grid: {
        face: 'top',
        cells: [
          [R, B],
          [Y, _],
        ] as (string | null)[][],
      },
    },
  ],
  // 노랑 (0,0,1)은 빨강 (0,0,0) 바로 뒤. 앞에서는 빨강이 가려서 안 보임.
  officialSolution: [
    { x: 0, y: 0, z: 0, color: R },
    { x: 1, y: 0, z: 0, color: B },
    { x: 0, y: 0, z: 1, color: Y },
  ],
};

// ──────────────────────────────────────────────────────────────────────
// Mission 3 — 반짝 보물탑
// 빨강 1, 파랑 2, 초록 1 / 앞 색 그림 + 위 ㄴ자 모양 모두 맞추기
// ──────────────────────────────────────────────────────────────────────
const MISSION_3: Scene = {
  id: 3,
  title: '반짝 보물탑',
  characterName: '큐브왕',
  storyText:
    '드디어 보물상자 앞이에요!\n보물상자는 “반짝 보물탑”이\n완성되어야 열려요.\n앞에서 본 그림과 위에서 본 자리를\n둘 다 맞춰주세요.',
  memo:
    '“앞에서 본 색깔 그림과\n위에서 본 자리 그림을\n모두 맞춰주세요.”',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '앞에서 본 색과 위에서 본 ㄴ자 모양을 둘 다 만들어 보물탑을 완성해주세요.',
  rules: [
    { type: 'exactCubeCount', count: 4 },
    { type: 'requiredColorCount', color: 'red',   count: 1 },
    { type: 'requiredColorCount', color: 'blue',  count: 2 },
    { type: 'requiredColorCount', color: 'green', count: 1 },
    {
      type: 'targetColorProjection',
      face: 'front',
      grid: [
        [_, G],
        [R, B],
      ],
    },
    {
      type: 'targetShapeProjection',
      face: 'top',
      grid: [
        [1, 1],
        [1, 0],
      ],
    },
  ],
  requiredColorCount: { red: 1, blue: 2, green: 1 },
  maxCubes: 4,
  exactCubes: 4,
  maxGridSize: { x: 3, y: 3, z: 3 },
  successText: '반짝반짝!\n보물탑이 완성되자\n보물상자가 열렸어요! 💎',
  hintText: '왼쪽 뒤에 파랑을 한 개 더 두면 위에서 ㄴ자 모양이 돼요.',
  hintStages: [
    { text: '앞에서 본 그림과 위에서 본 자리, 두 가지를 모두 맞춰야 해요.' },
    {
      text: '앞 줄에 빨강·파랑, 그 위에 초록을 올리고, 빨강 뒤에 파랑 한 개를 살짝 숨겨봐요.',
      grid: {
        face: 'top',
        cells: [
          [R, B],
          [B, _],
        ] as (string | null)[][],
      },
    },
  ],
  // 앞: 빨강·파랑(아래), 그 위 초록 / 위: ㄴ자 (뒤쪽 왼쪽 칸에 파랑 숨김)
  officialSolution: [
    { x: 0, y: 0, z: 0, color: R },
    { x: 1, y: 0, z: 0, color: B },
    { x: 1, y: 1, z: 0, color: G },
    { x: 0, y: 0, z: 1, color: B },
  ],
};

const buildMissions: Scene[] = [MISSION_1, MISSION_2, MISSION_3];

export const buildLevels: Level[] = [
  {
    difficulty: 'easy',
    name: '🌱 새싹 길',
    description: '큐브를 쌓아 비밀 건물 만들기',
    scenes: buildMissions,
  },
  {
    difficulty: 'medium',
    name: '🚀 용사 길',
    description: '큐브를 쌓아 비밀 건물 만들기',
    scenes: buildMissions,
  },
  {
    difficulty: 'hard',
    name: '🔥 마법사 길',
    description: '큐브를 쌓아 비밀 건물 만들기',
    scenes: buildMissions,
  },
];

export function getBuildLevelByDifficulty(difficulty: Difficulty): Level {
  return buildLevels.find(level => level.difficulty === difficulty) ?? buildLevels[0];
}

// 개발 모드: 각 미션의 officialSolution이 자기 rules를 모두 통과하는지 자동 검증.
const __DEV__ =
  typeof import.meta !== 'undefined' &&
  !!import.meta.env?.DEV;
if (__DEV__) {
  for (const mission of buildMissions) {
    if (!mission.officialSolution) {
      console.error(`[buildLevels] Mission "${mission.title}" has no officialSolution.`);
      continue;
    }
    const result = validateBuildMission(mission.officialSolution, mission);
    if (!result.success) {
      const failed = result.results.filter(r => !r.ok);
      console.error(
        `[buildLevels] Mission "${mission.title}" officialSolution FAILED:`,
        failed.map(r => `${r.label} (현재 ${r.current} / 목표 ${r.target})`).join(', '),
      );
    }
  }
}

// 헬퍼: 어떤 미션이든 단계별 힌트 배열을 안전하게 추출.
export function getHintStages(scene: Scene): HintStage[] {
  if (scene.hintStages && scene.hintStages.length > 0) return scene.hintStages;
  return [{ text: scene.hintText }];
}
