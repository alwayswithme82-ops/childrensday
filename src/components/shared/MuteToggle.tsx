import { useSoundStore } from '../../stores/useSoundStore';
import { motion } from 'framer-motion';

export function MuteToggle() {
  const { isMuted, toggleMute } = useSoundStore();
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      onClick={toggleMute}
      className="w-10 h-10 flex items-center justify-center rounded-full text-xl transition-colors"
      style={{ background: '#F3F4F6', color: '#555' }}
      aria-label={isMuted ? '음소거 해제' : '음소거'}
    >
      {isMuted ? '🔇' : '🔊'}
    </motion.button>
  );
}
