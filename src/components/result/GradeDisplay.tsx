import { motion } from 'framer-motion';
import type { Grade } from '../../types/game';
import { GRADE_CONFIG } from '../../utils/constants';

interface Props {
  grade: Grade;
}

export function GradeDisplay({ grade }: Props) {
  const cfg = GRADE_CONFIG[grade];
  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
      className="flex flex-col items-center gap-2"
    >
      <span className="text-7xl">{cfg.emoji}</span>
      <h2 className={`text-4xl font-black ${cfg.color}`}>{grade}</h2>
      <p className="text-sm font-700" style={{ color: '#888' }}>
        {grade === '큐브왕' ? '완벽해! 공간 감각이 천재급이야!' :
         grade === '건축사' ? '훌륭해! 건축사 자격증 발급!' :
         '도전 정신이 멋져! 다시 도전해봐!'}
      </p>
    </motion.div>
  );
}
