import { useEffect, useMemo, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import type { CubeData } from '../../types/game';
import { CubeBlock } from './CubeBlock';
import { ErrorBoundary } from '../shared/ErrorBoundary';

let webglSupportedCache: boolean | null = null;

function canUseWebGL(): boolean {
  if (webglSupportedCache !== null) return webglSupportedCache;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    webglSupportedCache = !!gl;
  } catch {
    webglSupportedCache = false;
  }
  return webglSupportedCache;
}

interface CameraInitProps {
  cx: number;
  cy: number;
  cz: number;
  viewMode: ViewMode;
}

type ViewMode = 'front' | 'back' | 'left' | 'right' | 'top' | 'free';

function CameraInit({ cx, cy, cz, viewMode }: CameraInitProps) {
  const { camera } = useThree();
  useEffect(() => {
    const distance = 6;
    const height = Math.max(cy + 1.6, 2.4);
    camera.up.set(0, 1, 0);
    if (viewMode === 'front') {
      camera.position.set(cx, height, cz - distance);
    } else if (viewMode === 'back') {
      camera.position.set(cx, height, cz + distance);
    } else if (viewMode === 'left') {
      camera.position.set(cx - distance, height, cz);
    } else if (viewMode === 'right') {
      camera.position.set(cx + distance, height, cz);
    } else if (viewMode === 'top') {
      camera.up.set(0, 0, 1);
      camera.position.set(cx, cy + distance + 2, cz);
    } else {
      camera.position.set(cx + 4.5, cy + 4, cz + 4.5);
    }
    camera.lookAt(cx, cy, cz);
    camera.updateProjectionMatrix();
  }, [camera, cx, cy, cz, viewMode]);
  return null;
}

interface Props {
  cubes: CubeData[];
}

export function CubeViewer({ cubes }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('front');
  const [contextLost, setContextLost] = useState(false);
  const supportsWebGL = canUseWebGL();

  const { cx, cy, cz } = useMemo(() => {
    const count = cubes.length || 1;
    return {
      cx: cubes.reduce((s, c) => s + c.x, 0) / count,
      cy: cubes.reduce((s, c) => s + c.y, 0) / count,
      cz: cubes.reduce((s, c) => s + c.z, 0) / count,
    };
  }, [cubes]);

  if (contextLost || !supportsWebGL) {
    return (
      <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 bg-slate-900 p-6 text-center">
        <p className="text-4xl">🧊</p>
        <p className="text-sm text-slate-300">3D 화면을 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => setContextLost(false)}
          disabled={!supportsWebGL}
          className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-navy"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative flex h-full min-h-[240px] sm:min-h-[280px] flex-col overflow-hidden rounded-xl bg-slate-900 sm:rounded-2xl"
    >
      <ErrorBoundary
        fallback={
          <div className="flex h-full min-h-[240px] items-center justify-center bg-slate-900 p-6 text-center text-sm text-slate-300">
            3D 화면을 표시할 수 없어요.
          </div>
        }
      >
        <Canvas
          className="touch-none"
          camera={{ position: [4, 4, 4], fov: 50 }}
          shadows
          onCreated={({ gl }) => {
            gl.domElement.style.touchAction = 'none';
            gl.domElement.addEventListener('webglcontextlost', (event) => {
              event.preventDefault();
              setContextLost(true);
            });
          }}
        >
          <Suspense fallback={null}>
            <CameraInit cx={cx} cy={cy} cz={cz} viewMode={viewMode} />

            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />

            {cubes.map((cube, i) => (
              <CubeBlock
                key={`${cube.x}-${cube.y}-${cube.z}-${i}`}
                position={[cube.x, cube.y, cube.z]}
                color={cube.color}
                delay={i * 80}
              />
            ))}

            <gridHelper args={[10, 10, '#334155', '#1E293B']} position={[cx, -0.5, cz]} />

            <OrbitControls
              key={viewMode}
              target={[cx, cy, cz]}
              enablePan={false}
              enableZoom={false}
              enableRotate={viewMode === 'free'}
              autoRotate={viewMode === 'free'}
              autoRotateSpeed={1.4}
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      <div className="pointer-events-none absolute left-3 top-3 grid grid-cols-2 gap-1 text-[11px] font-bold text-white/90 sm:text-xs">
        <span className="rounded-full bg-slate-950/70 px-2 py-1">🚪 앞</span>
        <span className="rounded-full bg-slate-950/70 px-2 py-1">🏰 뒤</span>
        <span className="rounded-full bg-slate-950/70 px-2 py-1">👈 왼쪽</span>
        <span className="rounded-full bg-slate-950/70 px-2 py-1">☁️ 위</span>
      </div>

      <div className="absolute bottom-3 left-3 right-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {[
          ['front', '👀 앞에서 보기'],
          ['back', '🏰 뒤에서 보기'],
          ['left', '👈 왼쪽에서 보기'],
          ['right', '👉 오른쪽에서 보기'],
          ['top', '☁️ 위에서 보기'],
          ['free', '🔄 자유롭게 돌리기'],
        ].map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode as ViewMode)}
            className={[
              'rounded-full px-2 py-2 text-xs font-bold transition sm:text-sm',
              viewMode === mode ? 'bg-gold text-navy' : 'bg-slate-950/75 text-white hover:bg-slate-800',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
