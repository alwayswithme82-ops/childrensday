import { motion } from 'framer-motion';

export function Logo() {
  return (
    <div className="flex flex-col items-center gap-3 select-none">

      {/* 아이콘 */}
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full blur-2xl scale-150"
          style={{ background: 'radial-gradient(circle, rgba(245,184,0,0.35), transparent 70%)' }}
        />
        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ transformStyle: 'preserve-3d', display: 'inline-block' }}
          className="relative text-7xl md:text-8xl"
        >
          🧊
        </motion.div>
      </div>

      {/* 타이틀 */}
      <div className="flex flex-col items-center gap-1">
        <h1
          className="text-6xl md:text-8xl font-black tracking-tight"
          style={{
            background: 'linear-gradient(170deg, #D97706 0%, #B45309 50%, #92400E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 8px rgba(180,83,9,0.25))',
          }}
        >
          큐브왕국
        </h1>
        <p
          className="text-xs font-black tracking-[0.3em] uppercase"
          style={{ color: 'rgba(180,83,9,0.45)' }}
        >
          Cube Kingdom
        </p>
      </div>

      {/* 부제 */}
      <p className="text-sm md:text-base font-semibold" style={{ color: 'rgba(120,60,0,0.55)' }}>
        색나무 마을의 비밀 건축가 — 3D 공간추론 어드벤처
      </p>
    </div>
  );
}
