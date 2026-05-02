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
    <div
      className="flex flex-col gap-2 px-4 py-3 border-b"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderColor: 'rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-lg font-bold" style={{ color: '#FF6B6B' }}>⏱ {formatTime(elapsed)}</span>
        <span className="text-sm font-700" style={{ color: '#888' }}>{sceneIndex + 1} / {totalScenes}</span>
        <div className="flex items-center gap-3">
          <span className="text-sm">{'⭐'.repeat(Math.min(stars, 9))}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onHint}
            disabled={hintsRemaining === 0}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-colors disabled:opacity-30"
            style={{ background: '#FFF9C4', color: '#F59E0B' }}
          >
            💡 {hintsRemaining}
          </motion.button>
          <MuteToggle />
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
        <motion.div
          className="h-full bg-yellow-400 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
