import { motion } from 'framer-motion';
import type { Grade } from '../../types/game';

const CFG: Record<Grade, { emoji: string; color: string; msg: string }> = {
  '큐브왕':  { emoji: '🏆', color: '#F59E0B', msg: '완벽해! 공간 감각 천재야!' },
  '건축사':  { emoji: '🏗',  color: '#3B82F6', msg: '훌륭해! 건축사 자격증 발급!' },
  '견습생':  { emoji: '🔨', color: '#6B7280', msg: '도전 정신이 멋져! 다시 해봐!' },
};

export function GradeDisplay({ grade }: { grade: Grade }) {
  const c = CFG[grade];
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <span className="text-7xl">{c.emoji}</span>
      <h2 className="text-4xl font-900" style={{ color: c.color }}>{grade}</h2>
      <p className="text-gray-400 font-600 text-sm">{c.msg}</p>
    </motion.div>
  );
}
