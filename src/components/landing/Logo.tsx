import { motion } from 'framer-motion';

export function Logo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="text-6xl select-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        🧊
      </motion.div>
      <h1
        className="text-4xl md:text-6xl font-black text-white tracking-tight"
        style={{
          textShadow: '4px 4px 0 #1d4ed8, 8px 8px 0 #1e3a8a, 12px 12px 20px rgba(0,0,0,0.5)',
        }}
      >
        큐브 왕국
      </h1>
      <p className="text-yellow-300 text-lg font-medium">3D 공간추론 어드벤처</p>
    </div>
  );
}
