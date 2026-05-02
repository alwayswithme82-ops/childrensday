import { useEffect } from 'react';

export function Confetti() {
  useEffect(() => {
    let frame: number;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d')!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 10 + 4,
      h: Math.random() * 6 + 3,
      color: ['#facc15','#3b82f6','#22c55e','#ef4444','#a855f7','#f97316'][Math.floor(Math.random()*6)],
      vy: Math.random() * 3 + 2,
      vx: (Math.random() - 0.5) * 2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.vy; p.x += p.vx; p.rot += p.rotV;
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      frame = requestAnimationFrame(draw);
    };
    draw();

    const stop = setTimeout(() => cancelAnimationFrame(frame), 4000);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(stop);
      document.body.removeChild(canvas);
    };
  }, []);

  return null;
}
