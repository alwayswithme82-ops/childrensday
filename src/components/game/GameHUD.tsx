import { formatTime } from '../../utils/helpers';
import { MuteToggle } from '../shared/MuteToggle';
import { motion } from 'framer-motion';

interface Props {
  elapsed: number;
  sceneIndex: number;
  totalScenes: number;
  stars: number;
  hintsRemaining: number;
  onHint: () => void;
}

export function GameHUD({ elapsed, sceneIndex, totalScenes, stars, hintsRemaining, onHint }: Props) {
  const progress = (sceneIndex / totalScenes) * 100;

  return (
    <div
      className="h-16 flex items-center px-6 gap-4 shrink-0"
      style={{ background: 'rgba(27,42,74,0.80)', backdropFilter: 'blur(12px)' }}
    >
      {/* 좌: 타이머 */}
      <span className="font-mono text-2xl font-bold text-gold shrink-0">⏱ {formatTime(elapsed)}</span>

      {/* 중: 장면 진행 */}
      <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
        <span className="text-sm font-medium text-white/70">장면 {sceneIndex + 1}/{totalScenes}</span>
        <div className="w-full max-w-xs h-2 rounded-full bg-gold/30">
          <motion.div
            className="h-full rounded-full bg-gold"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* 우: 별 + 힌트 + 음소거 */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-base tracking-tight leading-none">
          {'⭐'.repeat(Math.min(stars, 9))}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onHint}
          disabled={hintsRemaining === 0}
          className="flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full disabled:opacity-30 transition-opacity"
          style={{
            background: 'rgba(245,158,11,0.18)',
            color: '#F59E0B',
            border: '1px solid rgba(245,158,11,0.4)',
          }}
        >
          💡×{hintsRemaining}
        </motion.button>
        <MuteToggle />
      </div>
    </div>
  );
}
