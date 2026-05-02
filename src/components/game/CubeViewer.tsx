import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import type { CubeData } from '../../types/game';
import { CubeBlock } from './CubeBlock';

interface Props {
  cubes: CubeData[];
}

export function CubeViewer({ cubes }: Props) {
  const cx = cubes.reduce((s, c) => s + c.x, 0) / cubes.length;
  const cy = cubes.reduce((s, c) => s + c.y, 0) / cubes.length;
  const cz = cubes.reduce((s, c) => s + c.z, 0) / cubes.length;

  return (
    <div className="w-full h-full min-h-[280px] rounded-2xl overflow-hidden bg-white/50">
      <Canvas
        camera={{ position: [cx + 4, cy + 4, cz + 4], fov: 45 }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
          <pointLight position={[-3, 3, -3]} intensity={0.4} color="#a855f7" />
          <Environment preset="city" />

          <group position={[-cx, -cy, -cz]}>
            {cubes.map((cube, i) => (
              <CubeBlock key={`${cube.x}-${cube.y}-${cube.z}`} cube={cube} index={i} />
            ))}
          </group>

          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={12}
            autoRotate
            autoRotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
