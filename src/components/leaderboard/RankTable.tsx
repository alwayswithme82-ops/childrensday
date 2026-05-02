import { motion } from 'framer-motion';
import type { LeaderboardEntry } from '../../types/game';
import { formatTime } from '../../utils/helpers';

const RANK_ICON = ['🥇', '🥈', '🥉'];
const RANK_BG   = ['#FFFBEB', '#F9FAFB', '#FFF7ED'];
const RANK_BORDER = ['#F59E0B', '#E5E7EB', '#FB923C'];

interface Props { entries: LeaderboardEntry[]; myNickname?: string; }

export function RankTable({ entries, myNickname }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-gray-300">
        <div className="text-5xl mb-3">🏆</div>
        <p className="font-700">아직 기록이 없어요!</p>
        <p className="text-sm mt-1">첫 번째 도전자가 되어봐!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((e, i) => {
        const isMe = e.nickname === myNickname;
        return (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all"
            style={{
              background: i < 3 ? RANK_BG[i] : '#FAFAFA',
              borderColor: isMe ? '#F59E0B' : i < 3 ? RANK_BORDER[i] : '#F3F4F6',
              boxShadow: isMe ? '0 0 0 3px rgba(245,158,11,.15)' : 'none',
            }}
          >
            <span className="text-xl w-7 text-center">{i < 3 ? RANK_ICON[i] : `${i + 1}`}</span>
            <span className="font-800 flex-1 text-gray-800" style={{ color: isMe ? '#D97706' : undefined }}>
              {e.nickname}{isMe ? ' 👈' : ''}
            </span>
            <span className="text-sm font-700 text-gray-400">{e.stars}⭐</span>
            <span className="text-sm font-700 text-gray-400">{formatTime(e.clearTime)}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
