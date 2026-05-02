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
  const progress = ((sceneIndex) / totalScenes) * 100;

  return (
    <div className="flex flex-col gap-2 px-4 py-3 bg-slate-900/80 backdrop-blur border-b border-white/10">
      <div className="flex items-center justify-between">
        <span className="text-white font-mono text-lg font-bold">⏱ {formatTime(elapsed)}</span>
        <span className="text-white/70 text-sm">{sceneIndex + 1} / {totalScenes}</span>
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 text-sm">{'⭐'.repeat(Math.min(stars, 9))}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onHint}
            disabled={hintsRemaining === 0}
            className="flex items-center gap-1 bg-yellow-400/20 hover:bg-yellow-400/30 disabled:opacity-30 text-yellow-300 text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
          >
            💡 {hintsRemaining}
          </motion.button>
          <MuteToggle />
        </div>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-yellow-400 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
