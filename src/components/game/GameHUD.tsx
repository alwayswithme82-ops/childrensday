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
    <div className="bg-white border-b border-gray-100 px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-900 text-gray-700 tabular-nums">⏱ {formatTime(elapsed)}</span>
        <span className="text-sm font-700 text-gray-400">{sceneIndex + 1} / {totalScenes}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm">{'⭐'.repeat(Math.min(stars, 9))}</span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onHint} disabled={hintsRemaining === 0}
            className="text-xs font-800 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 disabled:opacity-30 transition-opacity">
            💡 {hintsRemaining}
          </motion.button>
          <MuteToggle />
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div className="h-full bg-amber-400 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>
    </div>
  );
}
