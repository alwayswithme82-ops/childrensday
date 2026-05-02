export function Logo() {
  return (
    <div className="flex flex-col items-center gap-3 select-none text-center">
      {/* 아이콘 */}
      <div className="spin-slow text-7xl md:text-8xl leading-none">🧊</div>

      {/* 타이틀 */}
      <h1
        className="font-black leading-none tracking-tight"
        style={{
          fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 60%, #B45309 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        큐브왕국
      </h1>

      {/* 부제 */}
      <p className="text-sm md:text-base font-700 text-gray-400 tracking-wide">
        색나무 마을의 비밀 건축가 · 3D 공간추론 퍼즐
      </p>

      {/* 뱃지 */}
      <div className="flex items-center gap-2 mt-1">
        <span className="inline-flex items-center gap-1 text-xs font-800 px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
          🎉 어린이날 특별 체험
        </span>
      </div>
    </div>
  );
}
