import type { Difficulty, Level, Scene } from '../types/game';

const buildMissions: Scene[] = [
  {
    id: 1,
    title: '그림자 문',
    storyText: '커다란 그림자 문이 길을 막고 있어요.\n앞에서 봤을 때 문에 새겨진 그림자와 같게\n큐브를 쌓아 문을 열어주세요!',
    characterName: '루비',
    cubes: [],
    questionType: 'building',
    mode: 'build',
    questionText: '앞에서 본 모습과 같게 큐브 2개를 쌓아보세요.',
    options: [],
    targetProjections: { front: [[1, 1]] },
    exactCubes: 2,
    maxCubes: 10,
    hintText: '앞에서 보면 가로로 나란히 보이는 큐브 두 칸이 필요해요. 바닥에 큐브 두 개를 옆으로 놓아봐요!',
    successText: '철컥! 그림자 문이 열렸어요.\n첫 번째 열쇠 조각을 찾았어요! 🗝️',
    projectionFaces: ['front'],
  },
  {
    id: 2,
    title: '보물지도 바닥',
    storyText: '바닥에 보물지도가 희미하게 나타났어요.\n위에서 봤을 때 지도 모양과 같게\n큐브를 놓아주세요!',
    characterName: '루비',
    cubes: [],
    questionType: 'building',
    mode: 'build',
    questionText: '하늘에서 내려다본 보물지도 모양을 큐브 3개로 완성해보세요.',
    options: [],
    targetProjections: { top: [[1, 1], [0, 1]] },
    exactCubes: 3,
    maxCubes: 10,
    hintText: '위에서 볼 때는 높이를 신경 쓰지 않아도 돼요. 바닥에 놓인 자리 모양만 지도처럼 맞춰봐요!',
    successText: '반짝! 보물지도가 황금빛으로 빛났어요.\n두 번째 열쇠 조각을 찾았어요! 🗝️',
    projectionFaces: ['top'],
  },
  {
    id: 3,
    title: '숨은 큐브 계단',
    storyText: '숨겨진 계단이 무너져 있어요.\n앞에서 봐도, 위에서 봐도\n마법 문양과 같아야 계단이 나타나요!',
    characterName: '루비',
    cubes: [],
    questionType: 'building',
    mode: 'build',
    questionText: '앞에서 본 모습과 위에서 본 모습을 모두 만족하는 계단을 만들어보세요.',
    options: [],
    targetProjections: {
      front: [[1, 0], [1, 1]],
      top: [[1, 1], [1, 0]],
    },
    exactCubes: 4,
    maxCubes: 10,
    hintText: '왼쪽에는 큐브가 한 층 더 올라가야 해요. 위에서 보이는 바닥 모양도 함께 확인해봐요!',
    successText: '딩동댕! 숨은 계단이 나타났어요.\n세 번째 열쇠 조각을 얻었어요! 🗝️',
    projectionFaces: ['front', 'top'],
  },
  {
    id: 4,
    title: '비밀 보물탑',
    storyText: '드디어 보물상자 앞에 도착했어요.\n하지만 상자 앞에는 무너진 큐브탑이 있었어요.\n앞에서 본 모습, 위에서 본 모습, 왼쪽에서 본 모습이 모두 맞아야\n마지막 열쇠가 나타나요!',
    characterName: '루비',
    cubes: [],
    questionType: 'building',
    mode: 'build',
    questionText: '세 방향의 마법 문양이 모두 맞는 비밀 보물탑을 완성해보세요.',
    options: [],
    targetProjections: {
      front: [[0, 1], [1, 1]],
      top: [[1, 1], [1, 1]],
      side: [[1, 0], [1, 1]],
    },
    exactCubes: 5,
    maxCubes: 10,
    hintText: '네 칸에 큐브가 모두 놓여야 하고, 오른쪽 뒤쪽 또는 앞쪽 중 한 곳은 한 층 더 높아야 해요. 왼쪽에서 본 모습도 확인해봐요!',
    successText: '쿠구궁! 비밀 보물탑이 황금빛으로 빛났어요.\n마지막 열쇠 조각을 찾았어요! 🗝️',
    projectionFaces: ['front', 'top', 'side'],
  },
];

export const buildLevels: Level[] = [
  {
    difficulty: 'easy',
    name: '🌱 새싹 길',
    description: '직접 쌓아보는 보물찾기 미션',
    scenes: buildMissions,
  },
  {
    difficulty: 'medium',
    name: '🚀 용사 길',
    description: '직접 쌓아보는 보물찾기 미션',
    scenes: buildMissions,
  },
  {
    difficulty: 'hard',
    name: '🔥 마법사 길',
    description: '직접 쌓아보는 보물찾기 미션',
    scenes: buildMissions,
  },
];

export function getBuildLevelByDifficulty(difficulty: Difficulty): Level {
  return buildLevels.find(level => level.difficulty === difficulty) ?? buildLevels[0];
}
