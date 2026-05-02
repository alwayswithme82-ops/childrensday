import { motion } from 'framer-motion';

const SPARKLES = [
  { x: -60, y: -20, delay: 0,    size: 'text-xl' },
  { x:  70, y: -30, delay: 0.4,  size: 'text-lg' },
  { x: -80, y:  30, delay: 0.8,  size: 'text-sm' },
  { x:  90, y:  20, delay: 0.2,  size: 'text-base' },
  { x:   0, y: -55, delay: 0.6,  size: 'text-sm' },
];

export function Logo() {
  return (
    <div className="flex flex-col items-center gap-2 select-none">

      {/* 큐브 아이콘 + 반짝이 */}
      <div className="relative flex items-center justify-center mb-2">
        {SPARKLES.map((s, i) => (
          <motion.span
            key={i}
            className={`absolute ${s.size} text-gold`}
            style={{ left: `calc(50% + ${s.x}px)`, top: `calc(50% + ${s.y}px)` }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          >
            ✨
          </motion.span>
        ))}

        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ transformStyle: 'preserve-3d' }}
          className="text-7xl md:text-8xl drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] z-10"
        >
          🧊
        </motion.div>
      </div>

      {/* 메인 타이틀 — shimmer gold */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="shimmer-text text-6xl md:text-8xl font-black tracking-tight"
        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      >
        큐브왕국
      </motion.h1>

      {/* 왕관 장식 라인 */}
      <div className="flex items-center gap-3 my-1">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
        <span className="text-gold text-xl">👑</span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
      </div>

      {/* 부제 */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="subtitle-glow text-gold-light text-lg md:text-xl font-semibold tracking-wide"
        style={{ color: '#FDE68A' }}
      >
        색나무 마을의 비밀 건축가
      </motion.p>

      {/* 별 장식 */}
      <motion.div
        className="flex gap-3 mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {['⭐','🌟','⭐','🌟','⭐'].map((s, i) => (
          <motion.span
            key={i}
            className="text-base"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
          >
            {s}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
