import { useSoundStore } from '../../stores/useSoundStore';
import { motion } from 'framer-motion';

export function MuteToggle() {
  const { isMuted, toggleMute } = useSoundStore();
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleMute}
      className="w-10 h-10 flex items-center justify-center rounded-full text-xl transition-all shadow-sm"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}
      aria-label={isMuted ? '음소거 해제' : '음소거'}
    >
      {isMuted ? '🔇' : '🔊'}
    </motion.button>
  );
}
