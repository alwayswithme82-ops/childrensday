import type { Difficulty, HintStage, Level, Scene } from '../types/game';
import { CUBE_COLOR_HEX } from '../utils/constants';
import { calculateColorProjection, validateBuildMission } from '../utils/buildValidation';

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
    '루비가 말했어요.\n“무지개 문이 망가졌어!\n빨강 큐브와 파랑 큐브로\n문을 다시 만들어줘!”',
  memo: '“앞에서 봤을 때\n그림과 같게 만들어주세요.”',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '앞에서 본 그림과 똑같이 큐브를 쌓아 무지개 문을 만들어보세요.',
  rules: [
    { type: 'exactCubeCount', count: 3, displayOnly: true },
    { type: 'requiredColorCount', color: 'red',  count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'blue', count: 2, displayOnly: true },
    {
      type: 'targetColorProjection',
      face: 'front',
      grid: [
        [_, _, _],
        [_, B, _],
        [R, B, _],
      ],
      requiredForSuccess: true,
    },
  ],
  requiredColorCount: { red: 1, blue: 2 },
  maxCubes: 9,
  exactCubes: 3,
  maxGridSize: { x: 3, y: 4, z: 3 },
  successText: '철컥!\n무지개 문이 활짝 열렸어요! 🌈',
  hintText: '왼쪽 아래에 빨강, 오른쪽에는 파랑 두 개를 세로로 쌓아요.',
  hintStages: [
    { text: '앞에서 본 그림과 똑같이 만들어 봐요. 빨강 1개, 파랑 2개를 쓰세요.' },
    {
      text: '왼쪽 아래에는 빨강, 오른쪽에는 파랑을 세로로 두 개 쌓아요.',
      grid: {
        face: 'front',
        cells: [
          [_, _, _],
          [_, B, _],
          [R, B, _],
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
    '노랑 큐브가 말했어요.\n“나는 부끄러워서\n앞에서는 안 보이고 싶어!”',
  memo:
    '“노랑 큐브를 꼭 사용하되,\n파랑 큐브 뒤쪽 바닥에 숨겨주세요.”',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '노랑 큐브를 파랑 큐브 뒤쪽 바닥에 숨겨, 앞에서는 빨강과 파랑만 보이게 만들어주세요.',
  rules: [
    {
      type: 'targetColorProjection',
      face: 'front',
      grid: [
        [_, _, _],
        [_, _, _],
        [R, B, _],
      ],
      requiredForSuccess: true,
    },
    { type: 'exactCubeCount', count: 3, displayOnly: true },
    { type: 'requiredColorCount', color: 'red',    count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'blue',   count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'yellow', count: 1, displayOnly: true },
    { type: 'colorMustBeHiddenFrom', color: 'yellow', face: 'front', displayOnly: true },
  ],
  requiredColorCount: { red: 1, blue: 1, yellow: 1 },
  maxCubes: 9,
  exactCubes: 3,
  maxGridSize: { x: 3, y: 4, z: 3 },
  successText: '앞에서 본 모습이 완성됐어요!\n숨바꼭질 성공! 🫣',
  hintText: '노랑은 파랑 큐브 바로 뒤쪽 바닥에 같은 높이로 놓으면 앞에서는 안 보여요.',
  hintStages: [
    { text: '앞에서 보면 빨강·파랑만 보여야 해요. 노랑은 파랑 큐브 위가 아니라, 같은 높이로 뒤에 놓아야 해요.' },
    {
      text: '노랑 큐브는 파랑 큐브의 “뒤쪽 바닥”에 놓아야 해요.\n파랑 큐브 위에 올리면 앞에서 노랑이 보여요.',
      grid: {
        face: 'top',
        cells: [
          [R, B, _],
          [_, Y, _],
          [_, _, _],
        ] as (string | null)[][],
      },
    },
  ],
  // 노랑 (1,0,1)은 파랑 (1,0,0) 바로 뒤쪽 바닥. 앞에서는 파랑이 가려서 안 보임.
  officialSolution: [
    { x: 0, y: 0, z: 0, color: R },
    { x: 1, y: 0, z: 0, color: B },
    { x: 1, y: 0, z: 1, color: Y },
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
    '드디어 보물상자 앞에 도착했어요!\n보물상자는 “반짝 보물탑”이\n완성되어야 열려요.',
  memo:
    '“앞에서 본 그림과\n위에서 본 자리를 모두 맞춰\n보물탑을 완성해주세요.”',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '앞에서 본 색과 위에서 본 ㄴ자 모양을 둘 다 만들어 보물탑을 완성해주세요.',
  rules: [
    { type: 'exactCubeCount', count: 4, displayOnly: true },
    { type: 'requiredColorCount', color: 'red',   count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'blue',  count: 2, displayOnly: true },
    { type: 'requiredColorCount', color: 'green', count: 1, displayOnly: true },
    {
      type: 'targetColorProjection',
      face: 'front',
      grid: [
        [_, _, _],
        [_, G, _],
        [R, B, _],
      ],
      requiredForSuccess: true,
    },
    {
      type: 'targetShapeProjection',
      face: 'top',
      grid: [
        [1, 1, 0],
        [1, 0, 0],
        [0, 0, 0],
      ],
      requiredForSuccess: true,
    },
  ],
  requiredColorCount: { red: 1, blue: 2, green: 1 },
  maxCubes: 12,
  exactCubes: 4,
  maxGridSize: { x: 3, y: 4, z: 3 },
  successText: '반짝반짝!\n보물탑이 완성되자\n보물상자가 열렸어요! 💎',
  hintText: '왼쪽 뒤에 파랑을 한 개 더 두면 위에서 ㄴ자 모양이 돼요.',
  hintStages: [
    { text: '앞에서 본 그림과 위에서 본 자리, 두 가지를 모두 맞춰야 해요.' },
    {
      text: '앞 줄에 빨강·파랑, 그 위에 초록을 올리고, 빨강 뒤에 파랑 한 개를 살짝 숨겨봐요.',
      grid: {
        face: 'top',
        cells: [
          [R, B, _],
          [B, _, _],
          [_, _, _],
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
  const sameGrid = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

  for (const mission of buildMissions) {
    if (!mission.officialSolution) {
      console.error(`[buildLevels] Mission "${mission.title}" has no officialSolution.`);
      continue;
    }
    const result = validateBuildMission(mission.officialSolution, mission, { strict: true });
    if (!result.success) {
      const failed = result.results.filter(r => !r.ok);
      console.error(
        `[buildLevels] Mission "${mission.title}" officialSolution FAILED:`,
        failed.map(r => `${r.label} (현재 ${r.current} / 목표 ${r.target})`).join(', '),
      );
    }
  }

  const hiddenYellowBehindBlue = [
    { x: 0, y: 0, z: 0, color: R },
    { x: 1, y: 0, z: 0, color: B },
    { x: 1, y: 0, z: 1, color: Y },
  ];
  const expectedMission2Front = [
    [_, _, _],
    [_, _, _],
    [R, B, _],
  ];
  const expectedMission2Top = [
    [R, B, _],
    [_, Y, _],
    [_, _, _],
  ];
  const hiddenFront = calculateColorProjection(hiddenYellowBehindBlue, 'front');
  const hiddenTop = calculateColorProjection(hiddenYellowBehindBlue, 'top');
  const hiddenResult = validateBuildMission(hiddenYellowBehindBlue, MISSION_2, { strict: true });
  if (
    !sameGrid(hiddenFront, expectedMission2Front) ||
    !sameGrid(hiddenTop, expectedMission2Top) ||
    !hiddenResult.success
  ) {
    console.error('[buildLevels] ❌ Mission 2 front/top projection regression:', {
      hiddenFront,
      expectedMission2Front,
      hiddenTop,
      expectedMission2Top,
      hiddenResult,
    });
  } else {
    console.log('[buildLevels] ✅ Mission 2: 파랑 뒤 노랑 숨김 배치 → front/top/validation PASS');
  }

  // Mission 2: 노랑이 파랑 위에 있어 앞에서 보이는 배치는 반드시 FAIL이어야 한다.
  const visibleYellowOnTopOfBlue = [
    { x: 0, y: 0, z: 0, color: R }, // 빨강
    { x: 1, y: 0, z: 0, color: B }, // 파랑
    { x: 1, y: 1, z: 0, color: Y }, // 노랑 — 파랑 위에 올라가 앞에서 보임
  ];
  const expectedBadFront = [
    [_, _, _],
    [_, Y, _],
    [R, B, _],
  ];
  const badFront = calculateColorProjection(visibleYellowOnTopOfBlue, 'front');
  const badResult = validateBuildMission(visibleYellowOnTopOfBlue, MISSION_2);
  if (!sameGrid(badFront, expectedBadFront) || badResult.success) {
    console.error('[buildLevels] ❌ Mission 2 검증 버그: 노랑 앞노출 배치가 잘못 처리됨!', {
      badFront,
      expectedBadFront,
      badResult,
      visibleYellowOnTopOfBlue,
    });
  } else {
    console.log('[buildLevels] ✅ Mission 2: 노랑 앞노출 배치 → 올바르게 FAIL 처리됨');
  }
}

// 헬퍼: 어떤 미션이든 단계별 힌트 배열을 안전하게 추출.
export function getHintStages(scene: Scene): HintStage[] {
  if (scene.hintStages && scene.hintStages.length > 0) return scene.hintStages;
  return [{ text: scene.hintText }];
}
