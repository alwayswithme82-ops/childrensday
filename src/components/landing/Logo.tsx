export function Logo() {
  return (
    <div className="flex flex-col items-center gap-2 text-center select-none">

      {/* 큐브 아이콘 */}
      <div className="spin-y text-6xl md:text-7xl mb-1">🧊</div>

      {/* 메인 타이틀 */}
      <h1
        className="font-fredoka leading-none"
        style={{
          fontSize: 'clamp(2.8rem, 9vw, 5rem)',
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 35%, #6BCB77 65%, #4D96FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 2px 0px rgba(0,0,0,0.08))',
        }}
      >
        큐브왕국
      </h1>

      {/* 영문 부제 */}
      <p className="font-fredoka text-sm md:text-base tracking-widest" style={{ color: '#aaa' }}>
        CUBE  KINGDOM
      </p>

      {/* 설명 */}
      <p className="text-sm font-700 text-gray-400 mt-1">
        3D 블록 공간추론 · 어린이날 특별 체험 🎉
      </p>

      {/* 어린이날 뱃지 */}
      <div
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-800 mt-1"
        style={{ background: 'linear-gradient(135deg, #FFD93D, #FF6B6B)', color: '#fff' }}
      >
        🎈 5월 5일 어린이날 기념
      </div>
    </div>
  );
}
