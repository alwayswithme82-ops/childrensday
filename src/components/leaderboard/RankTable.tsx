import { motion } from 'framer-motion';
import type { LeaderboardEntry } from '../../types/game';
import { formatTime } from '../../utils/helpers';
import { GRADE_CONFIG } from '../../utils/constants';

interface Props {
  entries: LeaderboardEntry[];
  myNickname?: string;
}

const RANK_MEDAL = ['👑', '🥈', '🥉'];
const RANK_ROW_STYLE: Record<number, string> = {
  0: 'bg-gold/10',
  1: 'bg-slate-300/10',
  2: 'bg-amber-700/10',
};

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export function RankTable({ entries, myNickname }: Props) {
  if (entries.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-5xl mb-4">🎮</p>
        <p className="font-fredoka text-xl text-white/50">아직 기록이 없어요!</p>
        <p className="text-sm text-white/30 mt-1">첫 도전자가 되어봐요</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <table className="w-full min-w-[540px] border-collapse">
        <thead>
          <tr style={{ background: '#1B2A4A' }}>
            {['순위', '닉네임', '⭐ 별', '⏱ 시간', '등급', '날짜'].map(h => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const isMe = entry.nickname === myNickname;
            const grade = GRADE_CONFIG[entry.grade];
            const rowBg = RANK_ROW_STYLE[i] ?? '';

            return (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={[
                  'border-b border-white/5 last:border-0 transition-colors',
                  rowBg,
                  isMe ? 'animate-pulse-slow outline outline-2 outline-gold outline-offset-[-2px]' : '',
                ].join(' ')}
              >
                {/* 순위 */}
                <td className="px-4 py-3.5 w-14">
                  <span className="text-lg leading-none">
                    {i < 3 ? RANK_MEDAL[i] : <span className="font-mono text-sm text-slate-500">{i + 1}</span>}
                  </span>
                </td>

                {/* 닉네임 */}
                <td className="px-4 py-3.5">
                  <span
                    className="font-bold text-sm"
                    style={{ color: isMe ? '#F59E0B' : '#F1F5F9' }}
                  >
                    {entry.nickname}
                    {isMe && <span className="ml-1.5 text-xs text-gold/70">(나)</span>}
                  </span>
                </td>

                {/* 별 */}
                <td className="px-4 py-3.5 text-sm text-gold font-mono">
                  {entry.stars}<span className="text-white/30">/{entry.maxStars}</span>
                </td>

                {/* 시간 */}
                <td className="px-4 py-3.5 text-sm font-mono text-slate-300">
                  {formatTime(entry.clearTime)}
                </td>

                {/* 등급 */}
                <td className="px-4 py-3.5">
                  <span className={`text-sm font-bold ${grade.color}`}>
                    {grade.emoji} {entry.grade}
                  </span>
                </td>

                {/* 날짜 */}
                <td className="px-4 py-3.5 text-xs text-slate-500">
                  {formatDate(entry.createdAt)}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
