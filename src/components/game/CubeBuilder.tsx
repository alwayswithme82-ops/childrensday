import { useEffect, useMemo, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text } from '@react-three/drei';
import type { CubeData } from '../../types/game';
import { ErrorBoundary } from '../shared/ErrorBoundary';

type ToolMode = 'build' | 'erase';
type ViewMode = 'front' | 'top' | 'left' | 'free';

const COLORS = ['#4D96FF', '#6BCB77', '#FFD93D', '#FF6B6B', '#C77DFF'];
const GRID_SIZE = 3;
const MAX_HEIGHT = 4;

interface CameraRigProps {
  viewMode: ViewMode;
}

function CameraRig({ viewMode }: CameraRigProps) {
  const { camera } = useThree();

  useEffect(() => {
    const target: [number, number, number] = [1, 0.8, 1];
    if (viewMode === 'front') camera.position.set(1, 3.2, 6.5);
    else if (viewMode === 'left') camera.position.set(-4.8, 3.2, 1);
    else if (viewMode === 'top') camera.position.set(1, 8, 1.01);
    else camera.position.set(5, 5, 5);
    camera.lookAt(...target);
    camera.updateProjectionMatrix();
  }, [camera, viewMode]);

  return null;
}

interface Props {
  cubes: CubeData[];
  onChange: (cubes: CubeData[]) => void;
  maxCubes?: number;
  disabled?: boolean;
  onLimit?: () => void;
}

function columnHeight(cubes: CubeData[], x: number, z: number) {
  return cubes.filter(c => c.x === x && c.z === z).length;
}

export function CubeBuilder({ cubes, onChange, maxCubes = 10, disabled = false, onLimit }: Props) {
  const [tool, setTool] = useState<ToolMode>('build');
  const [viewMode, setViewMode] = useState<ViewMode>('front');

  const sorted = useMemo(() => [...cubes].sort((a, b) => a.y - b.y), [cubes]);

  const addCube = (x: number, z: number) => {
    if (disabled || tool !== 'build') return;
    if (cubes.length >= maxCubes) {
      onLimit?.();
      return;
    }
    const y = columnHeight(cubes, x, z);
    if (y >= MAX_HEIGHT) return;
    onChange([...cubes, { x, y, z, color: COLORS[(x + z + y) % COLORS.length] }]);
  };

  const removeTop = (x: number, z: number) => {
    if (disabled) return;
    const top = [...cubes].filter(c => c.x === x && c.z === z).sort((a, b) => b.y - a.y)[0];
    if (!top) return;
    onChange(cubes.filter(c => !(c.x === top.x && c.y === top.y && c.z === top.z)));
  };

  const handleCell = (x: number, z: number) => {
    if (tool === 'erase') removeTop(x, z);
    else addCube(x, z);
  };

  return (
    <div className="flex h-full min-h-[360px] flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTool('build')}
          className={`rounded-full px-4 py-2 text-sm font-bold ${tool === 'build' ? 'bg-gold text-navy' : 'bg-slate-800 text-white'}`}
        >
          🧊 쌓기 모드
        </button>
        <button
          type="button"
          onClick={() => setTool('erase')}
          className={`rounded-full px-4 py-2 text-sm font-bold ${tool === 'erase' ? 'bg-red-400 text-white' : 'bg-slate-800 text-white'}`}
        >
          🧽 지우기 모드
        </button>
        <button
          type="button"
          onClick={() => onChange([])}
          disabled={disabled || cubes.length === 0}
          className="rounded-full bg-slate-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
        >
          ↺ 초기화
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-2xl bg-slate-900 touch-none">
        <ErrorBoundary fallback={<div className="flex h-full items-center justify-center text-sm text-slate-300">3D 조립판을 표시할 수 없어요.</div>}>
          <Canvas camera={{ position: [5, 5, 5], fov: 48 }} shadows className="touch-none">
            <CameraRig viewMode={viewMode} />
            <ambientLight intensity={0.62} />
            <directionalLight position={[5, 8, 5]} intensity={0.85} castShadow />

            {Array.from({ length: GRID_SIZE }).map((_, x) =>
              Array.from({ length: GRID_SIZE }).map((__, z) => (
                <mesh
                  key={`${x}-${z}`}
                  position={[x, -0.52, z]}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCell(x, z);
                  }}
                >
                  <boxGeometry args={[0.92, 0.08, 0.92]} />
                  <meshStandardMaterial color={(x + z) % 2 ? '#1E293B' : '#263449'} roughness={0.7} />
                </mesh>
              ))
            )}

            {sorted.map(cube => (
              <RoundedBox
                key={`${cube.x}-${cube.y}-${cube.z}`}
                args={[0.9, 0.9, 0.9]}
                radius={0.05}
                smoothness={4}
                position={[cube.x, cube.y, cube.z]}
                onClick={(e) => {
                  e.stopPropagation();
                  if (tool === 'erase') removeTop(cube.x, cube.z);
                  else addCube(cube.x, cube.z);
                }}
              >
                <meshStandardMaterial color={cube.color} roughness={0.35} metalness={0.08} />
              </RoundedBox>
            ))}

            <Text position={[1, 0.03, 3.05]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.26} color="#F59E0B" anchorX="center">
              🚪 앞
            </Text>
            <Text position={[1, 0.03, -1.05]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.22} color="#94A3B8" anchorX="center">
              뒤
            </Text>
            <Text position={[-1.05, 0.03, 1]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} fontSize={0.22} color="#F59E0B" anchorX="center">
              👈 왼쪽
            </Text>
            <Text position={[3.05, 0.03, 1]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} fontSize={0.22} color="#94A3B8" anchorX="center">
              오른쪽
            </Text>

            <OrbitControls
              target={[1, 0.8, 1]}
              enablePan={false}
              enableZoom={false}
              autoRotate={viewMode === 'free'}
              autoRotateSpeed={1.2}
            />
          </Canvas>
        </ErrorBoundary>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ['front', '👀 앞에서 보기'],
          ['top', '☁️ 위에서 보기'],
          ['left', '👈 왼쪽에서 보기'],
          ['free', '🔄 자유롭게 보기'],
        ].map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode as ViewMode)}
            className={`rounded-full px-3 py-2 text-xs font-bold sm:text-sm ${viewMode === mode ? 'bg-gold text-navy' : 'bg-slate-800 text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
