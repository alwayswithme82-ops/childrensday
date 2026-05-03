import type { Difficulty, Grade } from '../types/game';

export const CHARACTER_AVATARS: Record<string, string> = {
  '루비': '🧝',
  '레고': '🏗',
  '오르가': '🧙',
};

export const STORY_INTROS: Record<Difficulty, { text: string; characterName: string }> = {
  easy: {
    text: '안녕! 색나무 마을에 온 걸 환영해! 여기서 작은 집들을 살펴볼 거야.',
    characterName: '루비',
  },
  medium: {
    text: '건축가님, 이번엔 더 복잡한 건물이 기다리고 있어요!',
    characterName: '레고',
  },
  hard: {
    text: '전설의 큐브왕이 남긴 비밀 건축물... 풀 수 있겠어?',
    characterName: '오르가',
  },
};

export const STORY_ENDINGS: Record<Grade, string> = {
  '큐브왕': '완벽해! 모든 퍼즐을 한번에 풀다니, 진정한 큐브왕이야!',
  '건축사': '훌륭해! 대부분의 문제를 잘 풀었어. 건축사 자격증 발급!',
  '견습생': '좋은 시작이야! 더 연습하면 반드시 큐브왕이 될 수 있어!',
};
