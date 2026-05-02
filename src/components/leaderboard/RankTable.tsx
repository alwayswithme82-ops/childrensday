import type { LeaderboardEntry } from '../../types/game';
import { formatTime } from '../../utils/helpers';
import { GRADE_CONFIG } from '../../utils/constants';
import { motion } from 'framer-motion';

interface Props {
  entries: LeaderboardEntry[];
  myNickname?: string;
}

const RANK_STYLES = [
  'bg-yellow-400/20 border-yellow-400/40',
  'bg-white/10 border-white/20',
  'bg-orange-700/20 border-orange-700/40',
];
const RANK_ICONS = ['🥇', '🥈', '🥉'];

export function RankTable({ entries, myNickname }: Props) {
  if (entries.length === 0) {
    return <p className="text-center text-white/40 py-8">아직 기록이 없어요!</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry, i) => {
        const isMe = entry.nickname === myNickname;
        const grade = GRADE_CONFIG[entry.grade];
        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border
              ${i < 3 ? RANK_STYLES[i] : 'bg-white/5 border-white/10'}
              ${isMe ? 'ring-2 ring-yellow-400' : ''}
            `}
          >
            <span className="w-6 text-center text-lg">{i < 3 ? RANK_ICONS[i] : `${i + 1}`}</span>
            <span className={`font-bold flex-1 ${isMe ? 'text-yellow-400' : 'text-white'}`}>
              {entry.nickname}{isMe ? ' (나)' : ''}
            </span>
            <span className="text-white/50 text-sm">{entry.stars}⭐</span>
            <span className="text-white/50 text-sm">{formatTime(entry.clearTime)}</span>
            <span className={`text-xs font-bold ${grade.color}`}>{grade.emoji}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
