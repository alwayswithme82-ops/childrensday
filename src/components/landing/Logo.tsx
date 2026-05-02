import { motion } from 'framer-motion';

export function Logo() {
  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* 3D 큐브 아이콘 */}
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        style={{ transformStyle: 'preserve-3d', display: 'inline-block' }}
        className="text-5xl md:text-6xl drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]"
      >
        🧊
      </motion.div>

      {/* 메인 타이틀 */}
      <h1
        className="text-5xl md:text-7xl font-black tracking-tight text-white gold-text-shadow"
      >
        큐브왕국
      </h1>

      {/* 부제 */}
      <p className="text-base md:text-lg text-slate-400 font-medium tracking-wide">
        색나무 마을의 비밀 건축가
      </p>

      {/* 장식 별빛 */}
      <div className="flex gap-2 mt-1">
        {[0, 1, 2, 3, 4].map(i => (
          <motion.span
            key={i}
            className="text-gold text-xs"
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
          >
            ✦
          </motion.span>
        ))}
      </div>
    </div>
  );
}
