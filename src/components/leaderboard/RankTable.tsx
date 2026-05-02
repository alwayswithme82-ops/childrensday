import type { LeaderboardEntry } from '../../types/game';
import { formatTime } from '../../utils/helpers';
import { GRADE_CONFIG } from '../../utils/constants';
import { motion } from 'framer-motion';

interface Props {
  entries: LeaderboardEntry[];
  myNickname?: string;
}

const RANK_STYLES = [
  { bg: '#FFFDE7', border: '#FFD93D' },
  { bg: '#F9FAFB', border: '#E5E7EB' },
  { bg: '#FFF3E0', border: '#FFB74D' },
];
const RANK_ICONS = ['🥇', '🥈', '🥉'];

export function RankTable({ entries, myNickname }: Props) {
  if (entries.length === 0) {
    return (
      <p className="text-center py-8 font-fredoka text-lg" style={{ color: '#ccc' }}>
        아직 기록이 없어요! 첫 도전자가 되어봐 🎉
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry, i) => {
        const isMe = entry.nickname === myNickname;
        const grade = GRADE_CONFIG[entry.grade];
        const style = i < 3 ? RANK_STYLES[i] : { bg: '#fff', border: '#E5E7EB' };
        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2"
            style={{
              background: style.bg,
              borderColor: isMe ? '#FF6B6B' : style.border,
              boxShadow: isMe ? '0 0 0 2px #FF6B6B33' : '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <span className="w-6 text-center text-lg">{i < 3 ? RANK_ICONS[i] : `${i + 1}`}</span>
            <span className="font-fredoka flex-1 text-base" style={{ color: isMe ? '#FF6B6B' : '#1a1a2e' }}>
              {entry.nickname}{isMe ? ' (나)' : ''}
            </span>
            <span className="text-sm" style={{ color: '#888' }}>{entry.stars}⭐</span>
            <span className="text-sm" style={{ color: '#888' }}>{formatTime(entry.clearTime)}</span>
            <span className={`text-xs font-bold ${grade.color}`}>{grade.emoji}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
