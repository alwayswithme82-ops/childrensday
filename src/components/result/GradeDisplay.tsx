import { motion } from 'framer-motion';
import type { Grade } from '../../types/game';

interface Props {
  grade: Grade;
}

const GRADE_UI: Record<Grade, { emoji: string; title: string; color: string; sub: string }> = {
  '큐브왕': {
    emoji: '🏆',
    title: '전설의 큐브왕 탄생!',
    color: 'text-gold',
    sub: '완벽해! 공간 감각이 천재급이야!',
  },
  '건축사': {
    emoji: '🏗',
    title: '멋진 건축사!',
    color: 'text-blue-400',
    sub: '훌륭해! 건축사 자격증 발급!',
  },
  '견습생': {
    emoji: '🔨',
    title: '좋은 시작이야!',
    color: 'text-emerald-400',
    sub: '도전 정신이 멋져! 다시 도전해봐!',
  },
};

export function GradeDisplay({ grade }: Props) {
  const cfg = GRADE_UI[grade];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.2, 1], opacity: 1 }}
      transition={{ duration: 0.6, times: [0, 0.7, 1], ease: 'easeOut', delay: 0.2 }}
      className="flex flex-col items-center gap-3 text-center"
    >
      <span className="text-8xl leading-none">{cfg.emoji}</span>
      <h2 className={`text-4xl font-black ${cfg.color}`}>{cfg.title}</h2>
      <p className="text-base text-white/60">{cfg.sub}</p>
    </motion.div>
  );
}
