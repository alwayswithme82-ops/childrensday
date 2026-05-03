import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import type { CubeData } from '../../types/game';
import { CubeBlock } from './CubeBlock';
import { ErrorBoundary } from '../shared/ErrorBoundary';

interface CameraInitProps {
  cx: number;
  cy: number;
  cz: number;
}

function CameraInit({ cx, cy, cz }: CameraInitProps) {
  const { camera } = useThree();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    camera.lookAt(cx, cy, cz);
  }, [camera, cx, cy, cz]);
  return null;
}

interface Props {
  cubes: CubeData[];
}

export function CubeViewer({ cubes }: Props) {
  const [userInteracted, setUserInteracted] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const { cx, cy, cz } = useMemo(() => {
    const count = cubes.length || 1;
    return {
      cx: cubes.reduce((s, c) => s + c.x, 0) / count,
      cy: cubes.reduce((s, c) => s + c.y, 0) / count,
      cz: cubes.reduce((s, c) => s + c.z, 0) / count,
    };
  }, [cubes]);

  if (contextLost) {
    return (
      <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 bg-slate-900 p-6 text-center">
        <p className="text-4xl">🧊</p>
        <p className="text-sm text-slate-300">3D 화면을 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => setContextLost(false)}
          className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-navy"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full min-h-[240px] sm:min-h-[280px] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 touch-none"
      onPointerDown={() => setUserInteracted(true)}
    >
      <ErrorBoundary
        fallback={
          <div className="flex h-full min-h-[240px] items-center justify-center bg-slate-900 p-6 text-center text-sm text-slate-300">
            3D 화면을 표시할 수 없어요.
          </div>
        }
      >
        <Canvas
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
            <CameraInit cx={cx} cy={cy} cz={cz} />

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
              target={[cx, cy, cz]}
              enablePan={false}
              enableZoom={false}
              autoRotate={!userInteracted}
              autoRotateSpeed={1.4}
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
