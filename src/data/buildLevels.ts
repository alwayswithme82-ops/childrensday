import type { Difficulty, Level, Scene } from '../types/game';
import type { BuildRule } from '../types/game';
import { CUBE_COLOR_HEX } from '../utils/constants';
import { calculateColorProjection, validateBuildMission } from '../utils/buildValidation';

const R = CUBE_COLOR_HEX.red;
const B = CUBE_COLOR_HEX.blue;
const G = CUBE_COLOR_HEX.green;
const Y = CUBE_COLOR_HEX.yellow;
const _ = null;

function isDevelopmentRuntime(): boolean {
  if (typeof process !== 'undefined') return process.env.NODE_ENV !== 'production';
  if (typeof window !== 'undefined') {
    return ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
  }
  return false;
}

// 힌트 격자가 바닥부터 쌓여 있는지 검사 (side 방향 전용).
// 채워진 칸 아래가 비어 있으면 '공중부양' 힌트로 판단하고 경고한다.
function assertGroundedHint(
  grid: (string | null | number)[][],
  missionTitle: string,
  hintText: string,
): void {
  if (!isDevelopmentRuntime()) return;
  for (let c = 0; c < 3; c++) {
    for (let r = 0; r < 2; r++) {
      const cell = grid[r]?.[c];
      const below = grid[r + 1]?.[c];
      if (cell !== null && cell !== undefined && (below === null || below === undefined)) {
        console.warn('[buildLevels] Floating hint grid detected', {
          mission: missionTitle,
          hint: hintText,
          col: c,
          row: r,
          grid,
        });
        return;
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EASY MISSIONS (새싹 길) — ID 1·2·3
// ─────────────────────────────────────────────────────────────────────────────

const MISSION_E1: Scene = {
  id: 1,
  title: '무지개 문 만들기',
  characterName: '루비',
  storyText:
    '루비가 말했어요.\n"무지개 문이 망가졌어!\n빨강 큐브와 파랑 큐브로\n문을 다시 만들어줘!"',
  memo: '"앞에서 봤을 때\n그림과 같게 만들어주세요."',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '앞에서 본 그림과 똑같이 큐브를 쌓아 무지개 문을 만들어보세요.',
  rules: [
    { type: 'exactCubeCount',    count: 3,              displayOnly: true },
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
  maxGridSize: { x: 3, y: 3, z: 3 },
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
  officialSolution: [
    { x: 0, y: 0, z: 0, color: R },
    { x: 1, y: 0, z: 0, color: B },
    { x: 1, y: 1, z: 0, color: B },
  ],
};

const MISSION_E2: Scene = {
  id: 2,
  title: '숨바꼭질 노랑 큐브',
  characterName: '노랑 큐브',
  storyText:
    '노랑 큐브가 말했어요.\n"나는 부끄러워서\n앞에서는 안 보이고 싶어!"',
  memo:
    '"노랑 큐브를 꼭 사용하되,\n파랑 큐브 뒤쪽 바닥에 숨겨주세요."',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '노랑 큐브를 파랑 큐브 뒤에 숨겨, 앞에서는 빨강과 파랑만 보이게 만들어주세요.',
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
    { type: 'exactCubeCount',    count: 3,                 displayOnly: true },
    { type: 'requiredColorCount', color: 'red',    count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'blue',   count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'yellow', count: 1, displayOnly: true },
    { type: 'colorMustBeHiddenFrom', color: 'yellow', face: 'front', displayOnly: true },
  ],
  maxGridSize: { x: 3, y: 3, z: 3 },
  successText: '앞에서 본 모습이 완성됐어요!\n숨바꼭질 성공! 🫣',
  hintText: '노랑은 파랑 큐브 바로 뒤쪽 바닥에 같은 높이로 놓으면 앞에서는 안 보여요.',
  hintStages: [
    { text: '앞에서 보면 빨강·파랑만 보여야 해요. 노랑은 파랑 큐브 위가 아니라, 뒤에 놓아야 해요.' },
    {
      text: '위에서 보면 이 모양이에요. 노랑이 파랑 바로 뒤 칸에 있어요.',
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
  officialSolution: [
    { x: 0, y: 0, z: 0, color: R },
    { x: 1, y: 0, z: 0, color: B },
    { x: 1, y: 0, z: 1, color: Y },
  ],
};

const MISSION_E3: Scene = {
  id: 3,
  title: '반짝 보물탑',
  characterName: '큐브왕',
  storyText:
    '드디어 보물상자 앞에 도착했어요!\n보물상자는 "반짝 보물탑"이\n완성되어야 열려요.',
  memo:
    '"앞에서 본 그림과\n위에서 본 자리를 모두 맞춰\n보물탑을 완성해주세요."',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '앞에서 본 색과 위에서 본 ㄴ자 모양을 둘 다 만들어 보물탑을 완성해주세요.',
  rules: [
    { type: 'exactCubeCount',    count: 4,                displayOnly: true },
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
  maxGridSize: { x: 3, y: 3, z: 3 },
  successText: '반짝반짝!\n보물탑이 완성되자\n보물상자가 열렸어요! 💎',
  hintText: '왼쪽 뒤에 파랑을 한 개 더 두면 위에서 ㄴ자 모양이 돼요.',
  hintStages: [
    { text: '앞에서 본 그림과 위에서 본 자리, 두 가지를 모두 맞춰야 해요.' },
    {
      text: '위에서 보면 이 ㄴ자 모양이에요. 앞줄에 빨강·파랑, 그 위에 초록, 빨강 뒤에 파랑을 숨겨봐요.',
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
  officialSolution: [
    { x: 0, y: 0, z: 0, color: R },
    { x: 1, y: 0, z: 0, color: B },
    { x: 1, y: 1, z: 0, color: G },
    { x: 0, y: 0, z: 1, color: B },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MEDIUM MISSIONS (용사 길) — ID 4·5·6
// ─────────────────────────────────────────────────────────────────────────────

const MISSION_M1: Scene = {
  id: 4,
  title: '쌍둥이 기둥',
  characterName: '레고',
  storyText:
    '레고가 말했어요.\n"이 마을엔 쌍둥이 기둥이 있어!\n빨강은 두 층, 파랑·초록은 각각 한 층씩\n쌍둥이 기둥을 세워봐!"',
  memo:
    '"앞에서 본 그림과\n위에서 본 모양을 모두 맞춰주세요."',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '두 기둥을 나란히 세워봐요. 앞에서 본 색과 위에서 본 자리가 맞아야 해요.',
  rules: [
    { type: 'exactCubeCount',    count: 4,                 displayOnly: true },
    { type: 'requiredColorCount', color: 'red',   count: 2, displayOnly: true },
    { type: 'requiredColorCount', color: 'blue',  count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'green', count: 1, displayOnly: true },
    {
      type: 'targetColorProjection',
      face: 'front',
      // 앞에서 보면 왼쪽 기둥 2층(위:빨강, 아래:빨강), 오른쪽 기둥 2층(위:초록, 아래:파랑)
      grid: [
        [_, _, _],
        [R, G, _],
        [R, B, _],
      ],
      requiredForSuccess: true,
    },
    {
      type: 'targetShapeProjection',
      face: 'top',
      // 위에서 보면 앞줄에만 두 칸 (뒤로 깊이 없음)
      grid: [
        [1, 1, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      requiredForSuccess: true,
    },
  ],
  maxGridSize: { x: 3, y: 3, z: 3 },
  successText: '쌍둥이 기둥이 완성됐어요!\n마을이 든든해졌어요. 🏛️',
  hintText: '빨강을 왼쪽에 두 층, 오른쪽 아래는 파랑, 위는 초록으로 쌓아봐요.',
  hintStages: [
    { text: '앞에서 본 그림처럼 두 기둥을 쌓아봐요. 빨강 2개, 파랑 1개, 초록 1개를 쓰세요.' },
    {
      text: '왼쪽 기둥은 빨강 2층, 오른쪽 아래는 파랑, 오른쪽 위는 초록이에요.',
      grid: {
        face: 'front',
        cells: [
          [_, _, _],
          [R, G, _],
          [R, B, _],
        ] as (string | null)[][],
      },
    },
  ],
  officialSolution: [
    { x: 0, y: 0, z: 0, color: R },
    { x: 0, y: 1, z: 0, color: R },
    { x: 1, y: 0, z: 0, color: B },
    { x: 1, y: 1, z: 0, color: G },
  ],
};

const MISSION_M2: Scene = {
  id: 5,
  title: '뒤에 숨은 파랑',
  characterName: '레고',
  storyText:
    '레고가 말했어요.\n"앞에서 보면 세 칸인데\n뒤에 노랑이 숨어 있어!\n노랑을 파랑 뒤에 숨겨봐."',
  memo:
    '"앞에서 보면\n빨강·파랑·파랑 세 칸이어야 해요.\n노랑은 앞에서 보이면 안 돼요!"',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '앞에서 빨강, 파랑, 파랑 세 칸이 보이도록, 노랑은 파랑 뒤에 숨겨서 만들어봐요.',
  rules: [
    {
      type: 'targetColorProjection',
      face: 'front',
      // 앞에서: 빨강·파랑·파랑 세 칸이 바닥에 나란히
      grid: [
        [_, _, _],
        [_, _, _],
        [R, B, B],
      ],
      requiredForSuccess: true,
    },
    { type: 'exactCubeCount',    count: 4,                 displayOnly: true },
    { type: 'requiredColorCount', color: 'red',    count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'blue',   count: 2, displayOnly: true },
    { type: 'requiredColorCount', color: 'yellow', count: 1, displayOnly: true },
    { type: 'colorMustBeHiddenFrom', color: 'yellow', face: 'front', displayOnly: true },
  ],
  maxGridSize: { x: 3, y: 3, z: 3 },
  successText: '파랑이 노랑을 꼭 감췄어요!\n앞에서 보면 완벽해요. 🫣',
  hintText: '노랑은 (가운데)파랑 바로 뒤에, 오른쪽 파랑은 오른쪽 뒤 칸에 놓아요.',
  hintStages: [
    { text: '앞에서 보면 빨강·파랑·파랑 세 칸이 보여야 해요. 노랑은 파랑 뒤에 숨겨요.' },
    {
      text: '위에서 보면 이 모양이에요. 노랑은 파랑 바로 뒤, 오른쪽 파랑도 뒤에 있어요.',
      grid: {
        face: 'top',
        cells: [
          [R, B, _],
          [_, Y, B],
          [_, _, _],
        ] as (string | null)[][],
      },
    },
  ],
  officialSolution: [
    { x: 0, y: 0, z: 0, color: R },
    { x: 1, y: 0, z: 0, color: B },
    { x: 1, y: 0, z: 1, color: Y },
    { x: 2, y: 0, z: 1, color: B },
  ],
};

const MISSION_M3: Scene = {
  id: 6,
  title: 'ㄴ자 계단',
  characterName: '레고',
  storyText:
    '레고가 말했어요.\n"계단을 만들어야 성에 들어갈 수 있어!\nㄴ자 계단을 완성해봐."',
  memo:
    '"앞에서 본 그림과\n위에서 본 ㄴ자 모양을 맞춰주세요."',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '앞에서 본 색 그림과 위에서 본 ㄴ자 모양을 둘 다 완성해봐요.',
  rules: [
    { type: 'exactCubeCount',    count: 5,                 displayOnly: true },
    { type: 'requiredColorCount', color: 'red',    count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'blue',   count: 2, displayOnly: true },
    { type: 'requiredColorCount', color: 'yellow', count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'green',  count: 1, displayOnly: true },
    {
      type: 'targetColorProjection',
      face: 'front',
      // 앞에서: 왼쪽에 노랑(2층)·빨강(1층), 오른쪽에 파랑·파랑
      grid: [
        [_, _, _],
        [Y, _, _],
        [R, B, B],
      ],
      requiredForSuccess: true,
    },
    {
      type: 'targetShapeProjection',
      face: 'top',
      // 위에서: ㄴ자 모양 (앞줄 x=0,1, 뒷줄 x=0, x=2)
      grid: [
        [1, 1, 0],
        [1, 0, 1],
        [0, 0, 0],
      ],
      requiredForSuccess: true,
    },
  ],
  maxGridSize: { x: 3, y: 3, z: 3 },
  successText: 'ㄴ자 계단이 완성됐어요!\n성으로 들어갈 수 있어요. 🏰',
  hintText: '왼쪽에 빨강·노랑을 쌓고, 가운데 뒤쪽에 초록, 오른쪽에 파랑 두 개를 놓아요.',
  hintStages: [
    { text: '앞에서 왼쪽 기둥은 2층(빨강+노랑), 오른쪽은 파랑 두 개가 나란히 있어요.' },
    {
      text: '위에서 보면 ㄴ자 모양이에요. 뒤에 초록이 한 개 숨어 있어요.',
      grid: {
        face: 'top',
        cells: [
          [R, B, _],
          [G, _, B],
          [_, _, _],
        ] as (string | null)[][],
      },
    },
  ],
  officialSolution: [
    { x: 0, y: 0, z: 0, color: R },
    { x: 0, y: 1, z: 0, color: Y },
    { x: 1, y: 0, z: 0, color: B },
    { x: 0, y: 0, z: 1, color: G },
    { x: 2, y: 0, z: 1, color: B },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// HARD MISSIONS (마법사 길) — ID 7·8·9
// ─────────────────────────────────────────────────────────────────────────────

const MISSION_H1: Scene = {
  id: 7,
  title: '세 방향 탑',
  characterName: '오르가',
  storyText:
    '오르가가 말했어요.\n"마법의 탑은\n앞에서 본 모양과\n위에서 본 자리만 맞추면 빛날 거야!"',
  memo:
    '"앞에서 본 모양과\n위에서 본 자리를 맞춰주세요."',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '앞에서 본 탑 모양과 위에서 본 자리를 맞춰 마법의 탑을 완성해봐요.',
  rules: [
    { type: 'exactCubeCount',    count: 5,                 displayOnly: true },
    { type: 'requiredColorCount', color: 'red',    count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'blue',   count: 2, displayOnly: true },
    { type: 'requiredColorCount', color: 'green',  count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'yellow', count: 1, displayOnly: true },
    {
      type: 'targetShapeProjection',
      face: 'front',
      // 앞에서: 가운데 2층, 바닥 세 칸
      grid: [
        [0, 0, 0],
        [0, 1, 0],
        [1, 1, 1],
      ],
      requiredForSuccess: true,
    },
    {
      type: 'targetShapeProjection',
      face: 'top',
      // 위에서: 앞줄에 x=0,1, 뒷줄에 x=0,2
      grid: [
        [1, 1, 0],
        [1, 0, 1],
        [0, 0, 0],
      ],
      requiredForSuccess: true,
    },
  ],
  maxGridSize: { x: 3, y: 3, z: 3 },
  successText: '앞 모양과 위 자리가 맞았어요!\n마법의 탑이 빛나요! ✨',
  hintText: '앞에서 보면 가운데가 2층이고, 아래 줄은 세 칸이어야 해요. 위에서는 앞줄 두 칸, 뒷줄 두 칸이 보여요.',
  hintStages: [
    { text: '앞에서 본 탑 모양과 위에서 본 자리를 차례대로 맞춰봐요.' },
  ],
  officialSolution: [
    { x: 0, y: 0, z: 0, color: R },
    { x: 1, y: 0, z: 0, color: B },
    { x: 1, y: 1, z: 0, color: G },
    { x: 0, y: 0, z: 1, color: Y },
    { x: 2, y: 0, z: 1, color: B },
  ],
};

const MISSION_H2: Scene = {
  id: 8,
  title: '숨은 보석탑',
  characterName: '오르가',
  storyText:
    '오르가가 말했어요.\n"보석탑은 보물을 감추고 있어!\n앞에서 본 모양과\n위에서 본 자리만 맞춰봐."',
  memo:
    '"앞에서 본 모양과\n위에서 본 자리를 맞춰주세요."',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '앞에서 본 보석탑 모양과 위에서 본 자리를 맞춰 보석탑을 완성해봐요.',
  rules: [
    { type: 'exactCubeCount',    count: 6,                 displayOnly: true },
    { type: 'requiredColorCount', color: 'red',    count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'blue',   count: 2, displayOnly: true },
    { type: 'requiredColorCount', color: 'yellow', count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'green',  count: 2, displayOnly: true },
    {
      type: 'targetShapeProjection',
      face: 'front',
      // 앞에서: 2층 두 칸, 바닥 세 칸
      grid: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 1],
      ],
      requiredForSuccess: true,
    },
    {
      type: 'targetShapeProjection',
      face: 'top',
      // 위에서: 앞줄 x=0,1 / 뒷줄 x=1,2
      grid: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      requiredForSuccess: true,
    },
  ],
  maxGridSize: { x: 3, y: 3, z: 3 },
  successText: '앞 모양과 위 자리가 맞았어요!\n숨어 있던 보석이 드러났어요! 💎',
  hintText: '앞에서 보면 2층이 두 칸, 아래 줄이 세 칸이에요. 위에서는 앞줄 두 칸과 뒷줄 두 칸이 보여야 해요.',
  hintStages: [
    { text: '앞에서 본 탑 모양과 위에서 본 자리를 차례대로 맞춰봐요.' },
  ],
  officialSolution: [
    { x: 0, y: 0, z: 0, color: R },
    { x: 1, y: 0, z: 0, color: B },
    { x: 1, y: 1, z: 0, color: Y },
    { x: 1, y: 0, z: 1, color: G },
    { x: 2, y: 0, z: 1, color: B },
    { x: 2, y: 1, z: 1, color: G },
  ],
};

const MISSION_H3: Scene = {
  id: 9,
  title: '큐브왕의 왕관',
  characterName: '큐브왕',
  storyText:
    '큐브왕이 말했어요.\n"마지막 도전이야!\n앞과 뒤에서 본 모습이 똑같은\n왕관을 완성해봐."',
  memo:
    '"앞·위·뒤에서 본 모습을\n모두 맞춰주세요."',
  questionType: 'building',
  mode: 'build',
  cubes: [],
  options: [],
  questionText: '앞·위·뒤 세 방향 그림을 모두 맞춰 큐브왕의 왕관을 완성해봐요.',
  rules: [
    { type: 'exactCubeCount',    count: 7,                 displayOnly: true },
    { type: 'requiredColorCount', color: 'red',    count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'blue',   count: 2, displayOnly: true },
    { type: 'requiredColorCount', color: 'green',  count: 2, displayOnly: true },
    { type: 'requiredColorCount', color: 'yellow', count: 2, displayOnly: true },
    {
      type: 'targetColorProjection',
      face: 'front',
      // 앞에서: 2층에 노랑·초록·노랑, 바닥에 빨강·파랑·초록
      grid: [
        [_, _, _],
        [Y, G, Y],
        [R, B, G],
      ],
      requiredForSuccess: true,
    },
    {
      type: 'targetShapeProjection',
      face: 'top',
      // 위에서: 앞줄 세 칸 전부 + 뒤줄 가운데
      grid: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
      ],
      requiredForSuccess: true,
    },
    {
      type: 'targetColorProjection',
      face: 'back',
      // 뒤에서: 앞과 똑같이 보임 (구조 대칭)
      grid: [
        [_, _, _],
        [Y, G, Y],
        [R, B, G],
      ],
      requiredForSuccess: true,
    },
  ],
  maxGridSize: { x: 3, y: 3, z: 3 },
  successText: '왕관이 완성됐어요!\n큐브왕의 후계자가 탄생했어요! 👑',
  hintText: '앞에서 보이는 7개와 뒤에서 보이는 7개가 같은 모양이에요.',
  hintStages: [
    { text: '앞에서 본 그림을 먼저 맞춰봐요. 위 줄은 노랑·초록·노랑, 아래 줄은 빨강·파랑·초록이에요.' },
    {
      text: '위에서 보면 앞줄 세 칸과 뒤줄 가운데 한 칸이에요. 가운데 뒤에 초록이 숨어 있어요.',
      grid: {
        face: 'top',
        cells: [
          [Y, B, Y],
          [_, G, _],
          [_, _, _],
        ] as (string | null)[][],
      },
    },
    {
      text: '뒤에서도 앞에서 본 것과 똑같이 보여야 해요!',
      grid: {
        face: 'back',
        cells: [
          [_, _, _],
          [Y, G, Y],
          [R, B, G],
        ] as (string | null)[][],
      },
    },
  ],
  officialSolution: [
    { x: 0, y: 0, z: 0, color: R },
    { x: 1, y: 0, z: 0, color: B },
    { x: 2, y: 0, z: 0, color: G },
    { x: 0, y: 1, z: 0, color: Y },
    { x: 2, y: 1, z: 0, color: Y },
    { x: 1, y: 0, z: 1, color: B },
    { x: 1, y: 1, z: 1, color: G },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 난이도별 미션 배열
// ─────────────────────────────────────────────────────────────────────────────

const EASY_MISSIONS: Scene[]   = [MISSION_E1, MISSION_E2, MISSION_E3];
const MEDIUM_MISSIONS: Scene[] = [MISSION_M1, MISSION_M2, MISSION_M3];
const HARD_MISSIONS: Scene[]   = [MISSION_H1, MISSION_H2, MISSION_H3];

export const buildLevels: Level[] = [
  {
    difficulty: 'easy',
    name: '🌱 새싹 길',
    description: '그림을 보고 쉽게 따라 만드는 길',
    scenes: EASY_MISSIONS,
  },
  {
    difficulty: 'medium',
    name: '🚀 용사 길',
    description: '숨은 큐브와 위에서 본 모습을 생각하는 길',
    scenes: MEDIUM_MISSIONS,
  },
  {
    difficulty: 'hard',
    name: '🔥 마법사 길',
    description: '여러 방향에서 보이는 모습을 맞추는 길',
    scenes: HARD_MISSIONS,
  },
];

export function getBuildLevelByDifficulty(difficulty: Difficulty): Level {
  return buildLevels.find(level => level.difficulty === difficulty) ?? buildLevels[0];
}

export function getHintStages(scene: Scene) {
  const targetStages = (scene.rules ?? [])
    .filter((rule): rule is Extract<BuildRule, { type: 'targetColorProjection' | 'targetShapeProjection' }> =>
      (rule.type === 'targetColorProjection' || rule.type === 'targetShapeProjection') &&
      rule.displayOnly !== true &&
      rule.requiredForSuccess !== false,
    )
    .map(rule => ({
      text: `${rule.face === 'front' ? '앞에서' : rule.face === 'back' ? '뒤에서' : rule.face === 'top' ? '위에서' : rule.face === 'left' ? '왼쪽에서' : '오른쪽에서'} 본 목표 그림이에요.`,
      grid: { face: rule.face, cells: rule.grid },
    }));

  const textStages = (scene.hintStages ?? [])
    .filter(stage => !stage.grid)
    .map(stage => ({ text: stage.text }));

  if (targetStages.length > 0) return [...targetStages, ...textStages];
  if (scene.hintStages && scene.hintStages.length > 0) return scene.hintStages;
  return [{ text: scene.hintText }];
}

// ─────────────────────────────────────────────────────────────────────────────
// DEV 자동 검증
// ─────────────────────────────────────────────────────────────────────────────

const SIDE_FACES = new Set(['front', 'back', 'left', 'right']);

if (isDevelopmentRuntime()) {
  const allMissions = [...EASY_MISSIONS, ...MEDIUM_MISSIONS, ...HARD_MISSIONS];

  for (const mission of allMissions) {
    // 1) officialSolution → rules 통과 여부
    if (!mission.officialSolution) {
      console.error(`[buildLevels] Mission "${mission.title}" has no officialSolution.`);
      continue;
    }
    const result = validateBuildMission(mission.officialSolution, mission, { strict: true });
    if (!result.success) {
      const failed = result.results.filter(r => !r.ok);
      console.error(`[buildLevels] ❌ Mission "${mission.title}" officialSolution FAILED:`, {
        failed: failed.map(r => `${r.label} (현재 ${r.current} / 목표 ${r.target})`),
        front: calculateColorProjection(mission.officialSolution, 'front'),
        top:   calculateColorProjection(mission.officialSolution, 'top'),
        left:  calculateColorProjection(mission.officialSolution, 'left'),
        right: calculateColorProjection(mission.officialSolution, 'right'),
        back:  calculateColorProjection(mission.officialSolution, 'back'),
      });
    } else {
      console.log(`[buildLevels] ✅ "${mission.title}" officialSolution PASS`);
    }

    // 2) hintStages → side face는 바닥 정렬 여부 검사
    for (const stage of (mission.hintStages ?? [])) {
      if (!stage.grid) continue;
      if (SIDE_FACES.has(stage.grid.face)) {
        assertGroundedHint(stage.grid.cells, mission.title ?? '', stage.text);
      }
    }
  }
}
