import { motion } from 'framer-motion';

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(160deg,#FFFDE7,#FCE4EC,#E3F2FD)' }}>
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-yellow-400 rounded-sm"
            animate={{ y: [0, -16, 0], rotate: [0, 90, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
}
