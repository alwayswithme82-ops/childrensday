import { motion } from 'framer-motion';

export function Logo() {
  return (
    <div className="flex flex-col items-center gap-4 select-none">

      {/* 아이콘 */}
      <div className="relative">
        {/* 배경 glow */}
        <div
          className="absolute inset-0 rounded-full blur-2xl scale-150 opacity-40"
          style={{ background: 'radial-gradient(circle, #F5B800, transparent 70%)' }}
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
      <div className="flex flex-col items-center gap-1.5">
        <h1
          className="text-6xl md:text-8xl font-black tracking-tight"
          style={{
            background: 'linear-gradient(180deg, #FFE599 0%, #F5B800 45%, #C48A00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 16px rgba(245,184,0,0.45))',
          }}
        >
          큐브왕국
        </h1>
        <p className="text-base md:text-lg font-700 tracking-widest" style={{ color: 'rgba(255,213,102,0.65)', letterSpacing: '0.2em' }}>
          CUBE  KINGDOM
        </p>
      </div>

      {/* 부제 */}
      <p className="text-sm md:text-base font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>
        색나무 마을의 비밀 건축가 — 3D 공간추론 어드벤처
      </p>
    </div>
  );
}
