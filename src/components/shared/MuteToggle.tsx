import { useSoundStore } from '../../stores/useSoundStore';
import { motion } from 'framer-motion';

export function MuteToggle() {
  const { isMuted, toggleMute } = useSoundStore();
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleMute}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-lg transition-colors"
      aria-label={isMuted ? '음소거 해제' : '음소거'}
    >
      {isMuted ? '🔇' : '🔊'}
    </motion.button>
  );
}
