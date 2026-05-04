import type { BuildRule, Difficulty, HintStage, Level, Scene } from '../types/game';
import { CUBE_COLOR_HEX } from '../utils/constants';

const R = CUBE_COLOR_HEX.red;
const B = CUBE_COLOR_HEX.blue;
const G = CUBE_COLOR_HEX.green;
const _ = null;

// ──────────────────────────────────────────────────────────────────────
// 미션 1 — 첫 번째 메모: 비밀 건물의 재료
// 빨강 1, 파랑 4, 초록 2  (총 7개)
// ──────────────────────────────────────────────────────────────────────
const MISSION_1: Scene = {
  id: 1,
  title: '첫 번째 메모: 비밀 건물의 재료',
  characterName: '큐브왕의 메모',
  storyText:
    '큐브왕이 남긴 첫 번째 메모가 발견되었어요.\n메모에는 비밀 건물을 여는 데 필요한\n색깔 큐브의 개수가 적혀 있었어요.',
  memo:
    '“빨간색 블록 1개,\n파란색 블록 4개,\n초록색 블록 2개를 사용하라.”',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '메모 속 색깔 큐브를 정확한 개수로 사용해 비밀 건물의 재료를 모아보세요.',
  rules: [
    { type: 'exactCubeCount', count: 7 },
    { type: 'requiredColorCount', color: 'red',   count: 1 },
    { type: 'requiredColorCount', color: 'blue',  count: 4 },
    { type: 'requiredColorCount', color: 'green', count: 2 },
  ],
  requiredColorCount: { red: 1, blue: 4, green: 2 },
  maxCubes: 7,
  exactCubes: 7,
  maxGridSize: { x: 3, y: 4, z: 3 },
  successText:
    '좋아요! 비밀 건물의 재료가 모두 모였어요.\n큐브왕의 첫 번째 단서를 찾았어요!',
  hintText: '빨강 1개, 파랑 4개, 초록 2개를 모두 사용해야 해요.',
  hintStages: [
    { text: '메모를 다시 읽어봐요. 빨강 1개, 파랑 4개, 초록 2개 — 총 7개를 사용해야 해요.' },
    { text: '팔레트 아래 “남은 큐브 수”가 모두 0/총개수가 될 때까지 쌓아보세요.' },
  ],
};

// ──────────────────────────────────────────────────────────────────────
// 미션 2 — 두 번째 메모: 색깔이 만나는 규칙
// 미션 1 색 유지 + 빨강↔파랑 1번, 초록↔파랑 2번 (한 면으로 만남)
// ──────────────────────────────────────────────────────────────────────
const MISSION_2_RULES: BuildRule[] = [
  { type: 'exactCubeCount', count: 7 },
  { type: 'requiredColorCount', color: 'red',   count: 1 },
  { type: 'requiredColorCount', color: 'blue',  count: 4 },
  { type: 'requiredColorCount', color: 'green', count: 2 },
  { type: 'colorTouchCount', colorA: 'red',   colorB: 'blue', count: 1 },
  { type: 'colorTouchCount', colorA: 'green', colorB: 'blue', count: 2 },
];

const MISSION_2: Scene = {
  id: 2,
  title: '두 번째 메모: 색깔이 만나는 규칙',
  characterName: '큐브왕의 메모',
  storyText:
    '큐브왕의 두 번째 메모에는 이상한 규칙이 적혀 있었어요.\n큐브는 그냥 쌓는 것이 아니라,\n색깔끼리 만나는 방법도 중요했어요.',
  memo:
    '“빨간색 블록은 파란색 블록과 한 번 만나야 해.\n초록색 블록은 파란색 블록과 두 번 만나야 해.\n(꼭짓점이 아니라 한 면으로 만나야 해!)”',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '색깔 큐브들이 메모의 횟수만큼 한 면으로 만나도록 쌓아보세요.',
  rules: MISSION_2_RULES,
  requiredColorCount: { red: 1, blue: 4, green: 2 },
  maxCubes: 7,
  exactCubes: 7,
  maxGridSize: { x: 3, y: 4, z: 3 },
  successText:
    '색깔 큐브들이 정확히 만났어요!\n비밀 건물의 벽이 반짝이기 시작했어요.',
  hintText:
    '빨강은 파랑과 1번, 초록은 파랑과 2번 한 면으로 만나야 해요. 모서리만 닿는 건 세지 않아요.',
  hintStages: [
    { text: '“만남”은 두 큐브가 평평한 한 면으로 딱 붙은 경우만 세요. 모서리/꼭짓점은 ❌' },
    { text: '빨강은 파랑 옆에 한 번만 붙여요. 다른 곳은 떨어뜨려요.' },
    { text: '초록 2개가 각자 파랑 옆에 한 번씩 붙거나, 한 초록이 파랑 두 개를 동시에 붙어요.' },
  ],
};

// ──────────────────────────────────────────────────────────────────────
// 미션 3 — 세 번째 메모: 위에서 본 파란 큐브
// 색 개수 유지 + 위에서 본 파랑은 1개만 보임
// ──────────────────────────────────────────────────────────────────────
const MISSION_3: Scene = {
  id: 3,
  title: '세 번째 메모: 위에서 본 파란 큐브',
  characterName: '큐브왕의 메모',
  storyText:
    '세 번째 메모에는 방향에 대한 단서가 적혀 있었어요.\n큐브왕은 위에서 봤을 때 보이는 색깔까지\n계산해 두었어요.',
  memo:
    '“색깔 개수는 그대로 유지하라.\n단, 위에서 본 모습에서\n파란색은 한 개밖에 보이지 않아.”',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '위에서 봤을 때 파란 큐브가 1개만 보이도록 쌓아보세요. (다른 파랑은 다른 색 아래에 숨겨요.)',
  rules: [
    { type: 'exactCubeCount', count: 7 },
    { type: 'requiredColorCount', color: 'red',   count: 1 },
    { type: 'requiredColorCount', color: 'blue',  count: 4 },
    { type: 'requiredColorCount', color: 'green', count: 2 },
    { type: 'visibleColorCount', face: 'top', color: 'blue', count: 1 },
  ],
  requiredColorCount: { red: 1, blue: 4, green: 2 },
  maxCubes: 7,
  exactCubes: 7,
  maxGridSize: { x: 3, y: 4, z: 3 },
  successText:
    '위에서 본 파란색이 딱 한 개만 보여요!\n큐브왕의 숨은 규칙을 찾아냈어요.',
  hintText:
    '파란 큐브 4개 중 3개를 다른 색(빨강·초록) 아래에 숨겨요. 같은 (앞-위) 칸에 쌓으면 위에서는 위쪽 색만 보여요.',
  hintStages: [
    { text: '위에서 본 모습은 같은 (앞·왼쪽) 칸에서 가장 위에 있는 큐브만 보여요.' },
    { text: '파란 큐브 위에 빨강이나 초록을 올리면 그 자리는 위에서 빨강/초록만 보여요.' },
    {
      text: '예시: 파랑 위에 빨강·초록을 차곡차곡 올리고, 마지막 파랑 하나만 단독으로 둬요.',
      grid: {
        face: 'top',
        cells: [
          [R,    G,    G   ],
          [B,    _,    _   ],
          [_,    _,    _   ],
        ] as (string | null)[][],
      },
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────
// 미션 4 — 마지막 메모: 숨어 있는 노란 큐브
// 노랑 1 추가 (총 8개), 노랑↔파랑 1번, 노랑은 앞에서 안 보임,
// 앞에서 보이는 블록 수 = 뒤에서 보이는 블록 수
// ──────────────────────────────────────────────────────────────────────
const MISSION_4: Scene = {
  id: 4,
  title: '마지막 메모: 숨어 있는 노란 큐브',
  characterName: '큐브왕의 메모',
  storyText:
    '마지막 메모가 빛나기 시작했어요.\n이번에는 새롭게 나타난 노란 큐브가\n비밀을 가지고 있었어요.',
  memo:
    '“노란색 블록 한 개를 더해라.\n노란색은 파란색과 한 면으로만 만나야 해.\n단, 앞에서 보았을 때 노란색은 보이지 않아.\n그러면 앞에서 보이는 블록의 개수는\n뒤에서 보이는 블록의 개수와 같을까?”',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '노랑은 앞에서 안 보이게 숨기고, 앞·뒤에서 보이는 블록 수가 같도록 쌓아보세요.',
  rules: [
    { type: 'exactCubeCount', count: 8 },
    { type: 'requiredColorCount', color: 'red',    count: 1 },
    { type: 'requiredColorCount', color: 'blue',   count: 4 },
    { type: 'requiredColorCount', color: 'green',  count: 2 },
    { type: 'requiredColorCount', color: 'yellow', count: 1 },
    { type: 'colorTouchCount', colorA: 'yellow', colorB: 'blue', count: 1 },
    { type: 'colorMustBeHiddenFrom', color: 'yellow', face: 'front' },
    { type: 'visibleBlockCountCompare', faceA: 'front', faceB: 'back', relation: 'same' },
  ],
  requiredColorCount: { red: 1, blue: 4, green: 2, yellow: 1 },
  maxCubes: 8,
  exactCubes: 8,
  maxGridSize: { x: 3, y: 4, z: 3 },
  successText:
    '노란 큐브가 앞에서는 보이지 않게 숨어 있었어요!\n이제 큐브왕의 비밀 건물이 열립니다.',
  hintText:
    '노랑은 다른 큐브 뒤(뒤쪽 z)로 보내 앞에서 안 보이게 해요. 앞에서 보이는 칸과 뒤에서 보이는 칸 수가 같은지 확인해요.',
  hintStages: [
    { text: '“앞에서 본다”는 (앞·위) 칸 기준 가장 앞쪽(z 작은) 큐브만 보여요.' },
    { text: '노랑은 다른 색 큐브 뒤에 숨기되, 파란색과 한 면이 닿아야 해요.' },
    { text: '앞·뒤 보이는 블록 수가 같은지 카드의 비교 표시(=)를 확인해요.' },
  ],
};

const buildMissions: Scene[] = [MISSION_1, MISSION_2, MISSION_3, MISSION_4];

export const buildLevels: Level[] = [
  {
    difficulty: 'easy',
    name: '🌱 새싹 길',
    description: '큐브왕의 메모를 따라 비밀 건물 만들기',
    scenes: buildMissions,
  },
  {
    difficulty: 'medium',
    name: '🚀 용사 길',
    description: '큐브왕의 메모를 따라 비밀 건물 만들기',
    scenes: buildMissions,
  },
  {
    difficulty: 'hard',
    name: '🔥 마법사 길',
    description: '큐브왕의 메모를 따라 비밀 건물 만들기',
    scenes: buildMissions,
  },
];

export function getBuildLevelByDifficulty(difficulty: Difficulty): Level {
  return buildLevels.find(level => level.difficulty === difficulty) ?? buildLevels[0];
}

// 헬퍼: 어떤 미션이든 단계별 힌트 배열을 안전하게 추출.
export function getHintStages(scene: Scene): HintStage[] {
  if (scene.hintStages && scene.hintStages.length > 0) return scene.hintStages;
  return [{ text: scene.hintText }];
}
