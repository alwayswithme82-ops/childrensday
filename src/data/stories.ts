import type { Difficulty, Grade } from '../types/game';

export const CHARACTER_AVATARS: Record<string, string> = {
  '루비': '🧝',
  '레고': '🏗',
  '오르가': '🧙',
  '큐브왕': '👑',
  '큐브왕의 메모': '📜',
  '색나무 마을 사람': '🧑‍🌾',
};

export const STORY_INTROS: Record<Difficulty, { text: string; characterName: string }> = {
  easy: {
    text: '색나무 마을에 온 걸 환영해! 큐브왕의 첫 메모부터 함께 풀어보자.',
    characterName: '큐브왕의 메모',
  },
  medium: {
    text: '메모는 점점 까다로워질 거야. 색깔 큐브의 “만남”과 “보이는 모습”까지 살펴봐.',
    characterName: '큐브왕의 메모',
  },
  hard: {
    text: '큐브왕의 비밀 건물은 가장 깊은 메모를 풀어야 모습을 드러낸단다.',
    characterName: '큐브왕의 메모',
  },
};

export const STORY_ENDINGS: Record<Grade, string> = {
  '큐브왕': '완벽해! 네 장의 메모를 한 번에 풀다니, 진짜 큐브왕의 후계자야!',
  '건축사': '멋져! 비밀 건물이 색나무 마을에 다시 세워졌어. 어린이 건축가 인증!',
  '견습생': '좋은 시작이야! 메모를 다시 펼쳐 보면 더 큰 건물도 지을 수 있어.',
};
