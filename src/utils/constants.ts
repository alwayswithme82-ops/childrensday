import type { Difficulty, Grade } from '../types/game';

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  label: string;
  stars: number;
  color: string;
  ring: string;
  bg: string;
  timeBonus: number;
  hints: number;
}> = {
  easy:   { label: '쉬움',   stars: 1, color: 'text-emerald-400', ring: 'ring-emerald-400', bg: 'from-emerald-900/60 to-emerald-800/40', timeBonus: 90,  hints: 5 },
  medium: { label: '보통',   stars: 2, color: 'text-blue-400',    ring: 'ring-blue-400',    bg: 'from-blue-900/60 to-blue-800/40',       timeBonus: 150, hints: 3 },
  hard:   { label: '어려움', stars: 3, color: 'text-purple-400',  ring: 'ring-purple-400',  bg: 'from-purple-900/60 to-purple-800/40',   timeBonus: 240, hints: 2 },
};

export const GRADE_CONFIG: Record<Grade, {
  emoji: string;
  color: string;
  minPercent: number;
}> = {
  '큐브왕':  { emoji: '🏆', color: 'text-yellow-400', minPercent: 0.9 },
  '건축사':  { emoji: '🏗',  color: 'text-blue-400',   minPercent: 0.6 },
  '견습생':  { emoji: '🔨', color: 'text-gray-400',   minPercent: 0   },
};

export const CUBE_COLORS = {
  red:    '#ef4444',
  blue:   '#3b82f6',
  green:  '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  orange: '#f97316',
  cyan:   '#06b6d4',
  gray:   '#6b7280',
};

export const MAX_NICKNAME_LENGTH = 6;
export const LEADERBOARD_KEY = 'cube_leaderboard';
