export function Logo() {
  return (
    <div className="flex flex-col items-center gap-2 select-none text-center">
      <div className="spin-y text-6xl md:text-7xl">🧊</div>

      <h1
        className="font-fredoka leading-none tracking-wide"
        style={{
          fontSize: 'clamp(3rem, 10vw, 5.5rem)',
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 40%, #6BCB77 70%, #4D96FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        큐브왕국
      </h1>

      <p className="font-fredoka text-sm tracking-[0.25em] text-gray-400">
        CUBE  KINGDOM
      </p>

      <p className="text-sm font-700 text-gray-400 mt-1">
        3D 블록 공간추론 · 어린이날 특별 체험 🎉
      </p>
    </div>
  );
}
