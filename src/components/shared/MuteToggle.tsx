import { useSoundStore } from '../../stores/useSoundStore';
import { motion } from 'framer-motion';

export function MuteToggle() {
  const { isMuted, toggleMute } = useSoundStore();
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleMute}
      className="w-9 h-9 flex items-center justify-center rounded-full text-lg transition-colors"
      style={{ background: 'rgba(0,0,0,0.07)', color: 'rgba(0,0,0,0.5)' }}
      aria-label={isMuted ? '음소거 해제' : '음소거'}
    >
      {isMuted ? '🔇' : '🔊'}
    </motion.button>
  );
}
