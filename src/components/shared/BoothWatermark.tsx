export function BoothWatermark() {
  return (
    <div
      className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none"
      aria-hidden
    >
      <span
        className="font-fredoka text-xs px-3 py-1 rounded-full"
        style={{
          background: 'rgba(0,0,0,0.35)',
          color: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(4px)',
          letterSpacing: '0.04em',
        }}
      >
        🎪 어린이날 큐브왕국 부스
      </span>
    </div>
  );
}
