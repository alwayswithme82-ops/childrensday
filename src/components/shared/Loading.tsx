import { motion } from 'framer-motion';

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-4 h-4 bg-amber-400 rounded-sm"
            animate={{ y: [0, -14, 0], rotate: [0, 90, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }} />
        ))}
      </div>
    </div>
  );
}
