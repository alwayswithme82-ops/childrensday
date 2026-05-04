import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { CubeColorKey, CubeData, GridSize } from '../../types/game';
import { CUBE_COLOR_HEX, CUBE_COLOR_LABEL, CUBE_COLOR_ORDER } from '../../utils/constants';
import { ErrorBoundary } from '../shared/ErrorBoundary';

type ToolMode = 'build' | 'erase';
type ViewMode = 'front' | 'top' | 'left' | 'free';

const DEFAULT_GRID: GridSize = { x: 3, y: 4, z: 3 };
const TAP_THRESHOLD_PX = 8;

interface Props {
  cubes: CubeData[];
  onChange: (cubes: CubeData[]) => void;
  maxCubes?: number;
  maxGridSize?: GridSize;
  requiredColorCount?: Partial<Record<CubeColorKey, number>>;
  disabled?: boolean;
  onLimit?: () => void;
}

interface CameraRigProps {
  viewMode: ViewMode;
  target: [number, number, number];
}

function CameraRig({ viewMode, target }: CameraRigProps) {
  const { camera } = useThree();
  useEffect(() => {
    const [tx, ty, tz] = target;
    if (viewMode === 'front')      camera.position.set(tx, ty + 1.6, tz + 5.6);
    else if (viewMode === 'left')  camera.position.set(tx - 5.6, ty + 1.6, tz);
    else if (viewMode === 'top')   camera.position.set(tx, ty + 7, tz + 0.001);
    else                            camera.position.set(tx + 4, ty + 4, tz + 4);
    camera.lookAt(tx, ty, tz);
    camera.updateProjectionMatrix();
  }, [camera, viewMode, target]);
  return null;
}

interface BridgeProps {
  cameraRef: React.MutableRefObject<THREE.Camera | null>;
}
function SceneBridge({ cameraRef }: BridgeProps) {
  const { camera } = useThree();
  useEffect(() => { cameraRef.current = camera; }, [camera, cameraRef]);
  return null;
}

export function CubeBuilder({
  cubes,
  onChange,
  maxCubes = 10,
  maxGridSize = DEFAULT_GRID,
  requiredColorCount,
  disabled = false,
  onLimit,
}: Props) {
  const [tool, setTool] = useState<ToolMode>('build');
  const [viewMode, setViewMode] = useState<ViewMode>('front');
  const [selectedColor, setSelectedColor] = useState<CubeColorKey | null>(null);
  const [draggingColor, setDraggingColor] = useState<CubeColorKey | null>(null);
  const [hoverCell, setHoverCell] = useState<{ x: number; z: number } | null>(null);
  const [pointerScreen, setPointerScreen] = useState<{ x: number; y: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<CubeData[][]>([]);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);

  // Refs mirror state/props for use inside global event listeners
  const cubesRef = useRef(cubes);
  const requiredRef = useRef(requiredColorCount);
  const maxCubesRef = useRef(maxCubes);
  const maxGridRef = useRef(maxGridSize);
  const disabledRef = useRef(disabled);
  const draggingRef = useRef<CubeColorKey | null>(null);
  const hoverRef = useRef<{ x: number; z: number } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const pointerScreenRef = useRef<{ x: number; y: number } | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { cubesRef.current = cubes; }, [cubes]);
  useEffect(() => { requiredRef.current = requiredColorCount; }, [requiredColorCount]);
  useEffect(() => { maxCubesRef.current = maxCubes; }, [maxCubes]);
  useEffect(() => { maxGridRef.current = maxGridSize; }, [maxGridSize]);
  useEffect(() => { disabledRef.current = disabled; }, [disabled]);
  useEffect(() => { draggingRef.current = draggingColor; }, [draggingColor]);
  useEffect(() => { hoverRef.current = hoverCell; }, [hoverCell]);

  const target: [number, number, number] = useMemo(
    () => [
      (maxGridSize.x - 1) / 2,
      Math.max(0.6, (maxGridSize.y - 1) * 0.35),
      (maxGridSize.z - 1) / 2,
    ],
    [maxGridSize],
  );

  const paletteColors = useMemo<CubeColorKey[]>(() => {
    if (requiredColorCount) {
      return CUBE_COLOR_ORDER.filter(
        c => requiredColorCount[c] !== undefined && (requiredColorCount[c] ?? 0) > 0,
      );
    }
    return CUBE_COLOR_ORDER;
  }, [requiredColorCount]);

  // ----- Pure helpers -----
  const topYAt = (cs: CubeData[], x: number, z: number) =>
    cs.filter(c => c.x === x && c.z === z).length;

  const usedOf = (cs: CubeData[], color: CubeColorKey) =>
    cs.filter(c => c.color === CUBE_COLOR_HEX[color]).length;

  const showError = (msg: string) => {
    setErrorMsg(msg);
    if (errorTimerRef.current !== null) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setErrorMsg(null), 1800);
  };

  const checkPlacement = (
    _color: CubeColorKey,
    x: number,
    z: number,
  ): { ok: boolean; reason?: string } => {
    if (disabledRef.current) return { ok: false };
    const cs = cubesRef.current;
    if (cs.length >= maxCubesRef.current) return { ok: false, reason: '큐브를 너무 많이 쌓았어요!' };
    if (topYAt(cs, x, z) >= maxGridRef.current.y) return { ok: false, reason: '여기에는 더 이상 쌓을 수 없어요!' };
    return { ok: true };
  };

  const placeCube = (color: CubeColorKey, x: number, z: number) => {
    const r = checkPlacement(color, x, z);
    if (!r.ok) {
      if (r.reason) showError(r.reason);
      onLimit?.();
      return;
    }
    const cs = cubesRef.current;
    const y = topYAt(cs, x, z);
    setHistory(h => [...h, cs]);
    onChange([...cs, { x, y, z, color: CUBE_COLOR_HEX[color] }]);
  };

  const removeTopAt = (x: number, z: number) => {
    if (disabledRef.current) return;
    const cs = cubesRef.current;
    const top = [...cs].filter(c => c.x === x && c.z === z).sort((a, b) => b.y - a.y)[0];
    if (!top) return;
    setHistory(h => [...h, cs]);
    onChange(cs.filter(c => !(c.x === top.x && c.y === top.y && c.z === top.z)));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    onChange(prev);
  };

  const handleReset = () => {
    if (cubes.length === 0) return;
    setHistory(h => [...h, cubes]);
    onChange([]);
    setSelectedColor(null);
  };

  // ----- Global drag handlers (always-on, no-op when not dragging) -----
  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.5); // y = -0.5
    const hitPoint = new THREE.Vector3();

    const computeHover = (clientX: number, clientY: number) => {
      const container = canvasContainerRef.current;
      const camera = cameraRef.current;
      if (!container || !camera) return null;
      const rect = container.getBoundingClientRect();
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      if (ndc.x < -1 || ndc.x > 1 || ndc.y < -1 || ndc.y > 1) return null;
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.ray.intersectPlane(plane, hitPoint);
      if (!hit) return null;
      const x = Math.round(hitPoint.x);
      const z = Math.round(hitPoint.z);
      const grid = maxGridRef.current;
      if (x < 0 || x >= grid.x || z < 0 || z >= grid.z) return null;
      return { x, z };
    };

    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      pointerScreenRef.current = { x: e.clientX, y: e.clientY };
      setPointerScreen({ x: e.clientX, y: e.clientY });
      const cell = computeHover(e.clientX, e.clientY);
      setHoverCell(cell);
    };

    const finishDrag = () => {
      const dragging = draggingRef.current;
      if (!dragging) return;
      const cell = hoverRef.current;
      if (cell) {
        placeCube(dragging, cell.x, cell.z);
      } else {
        const start = dragStartRef.current;
        const last = pointerScreenRef.current ?? start;
        const distance = start && last ? Math.hypot(last.x - start.x, last.y - start.y) : 0;
        if (distance < TAP_THRESHOLD_PX) {
          setSelectedColor(prev => (prev === dragging ? null : dragging));
        }
      }
      setDraggingColor(null);
      setHoverCell(null);
      setPointerScreen(null);
      dragStartRef.current = null;
      pointerScreenRef.current = null;
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
      if (errorTimerRef.current !== null) clearTimeout(errorTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Palette interaction -----
  const handlePalettePointerDown = (color: CubeColorKey, e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    setTool('build');
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    pointerScreenRef.current = { x: e.clientX, y: e.clientY };
    setDraggingColor(color);
    setPointerScreen({ x: e.clientX, y: e.clientY });
    // Release implicit pointer capture so window listeners receive subsequent events on touch
    const t = e.currentTarget;
    if (t.hasPointerCapture(e.pointerId)) t.releasePointerCapture(e.pointerId);
  };

  // Keyboard accessibility: Enter/Space toggles selection
  const handlePaletteKeyDown = (color: CubeColorKey, e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (disabled) return;
    setTool('build');
    setSelectedColor(prev => (prev === color ? null : color));
  };

  // ----- Cell / cube interaction (tap-to-place & erase) -----
  const handleCellPointerDown = (x: number, z: number) => {
    if (disabled) return;
    if (tool === 'erase') {
      removeTopAt(x, z);
      return;
    }
    if (selectedColor) placeCube(selectedColor, x, z);
  };

  const handleCubePointerDown = (cube: CubeData) => {
    if (disabled) return;
    if (tool === 'erase') {
      removeTopAt(cube.x, cube.z);
      return;
    }
    if (selectedColor) placeCube(selectedColor, cube.x, cube.z);
  };

  // ----- Derived render values -----
  const activeColor = draggingColor ?? selectedColor;
  const hoverY = hoverCell ? Math.min(topYAt(cubes, hoverCell.x, hoverCell.z), maxGridSize.y - 1) : 0;
  const canPreviewPlace = !!(
    hoverCell && activeColor && checkPlacement(activeColor, hoverCell.x, hoverCell.z).ok
  );
  const sortedCubes = useMemo(() => [...cubes].sort((a, b) => a.y - b.y), [cubes]);

  return (
    <div className="flex h-full min-h-[420px] flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { setTool('build'); }}
          aria-pressed={tool === 'build'}
          className={`rounded-full px-4 py-2 text-sm font-bold ${tool === 'build' ? 'bg-gold text-navy' : 'bg-slate-800 text-white'}`}
        >
          🧊 쌓기
        </button>
        <button
          type="button"
          onClick={() => { setTool('erase'); setSelectedColor(null); }}
          aria-pressed={tool === 'erase'}
          className={`rounded-full px-4 py-2 text-sm font-bold ${tool === 'erase' ? 'bg-red-400 text-white' : 'bg-slate-800 text-white'}`}
        >
          🧽 지우기
        </button>
        <button
          type="button"
          onClick={handleUndo}
          disabled={disabled || history.length === 0}
          className="rounded-full bg-slate-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
        >
          ↩️ 되돌리기
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={disabled || cubes.length === 0}
          className="rounded-full bg-slate-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
        >
          🔄 처음부터
        </button>
      </div>

      <p className="text-center text-xs text-slate-300 select-none">
        🎨 큐브를 끌어다 놓거나, 색을 고른 뒤 자리를 눌러보세요!
      </p>

      {/* Canvas */}
      <div
        ref={canvasContainerRef}
        className="relative flex-1 overflow-hidden rounded-2xl bg-slate-900 touch-none"
        style={{ touchAction: 'none' }}
      >
        <ErrorBoundary
          fallback={
            <div className="flex h-full items-center justify-center text-sm text-slate-300">
              3D 조립판을 표시할 수 없어요.
            </div>
          }
        >
          <Canvas camera={{ position: [5, 5, 5], fov: 48 }} shadows className="touch-none">
            <Suspense fallback={null}>
            <CameraRig viewMode={viewMode} target={target} />
            <SceneBridge cameraRef={cameraRef} />
            <ambientLight intensity={0.62} />
            <directionalLight position={[5, 8, 5]} intensity={0.85} castShadow />

            {/* Floor cells */}
            {Array.from({ length: maxGridSize.x }).map((_, x) =>
              Array.from({ length: maxGridSize.z }).map((__, z) => {
                const isHover = hoverCell?.x === x && hoverCell?.z === z;
                const baseColor = (x + z) % 2 ? '#1E293B' : '#263449';
                const emissive = isHover && activeColor
                  ? (canPreviewPlace ? '#22c55e' : '#ef4444')
                  : '#000000';
                return (
                  <mesh
                    key={`floor-${x}-${z}`}
                    position={[x, -0.52, z]}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      handleCellPointerDown(x, z);
                    }}
                    onPointerEnter={() => {
                      if (!disabledRef.current && (draggingRef.current || selectedColor)) {
                        setHoverCell({ x, z });
                      }
                    }}
                    onPointerLeave={() => {
                      if (!draggingRef.current) {
                        setHoverCell(prev => (prev?.x === x && prev?.z === z ? null : prev));
                      }
                    }}
                  >
                    <boxGeometry args={[0.92, 0.08, 0.92]} />
                    <meshStandardMaterial
                      color={isHover ? '#475569' : baseColor}
                      emissive={emissive}
                      emissiveIntensity={isHover && activeColor ? 0.55 : 0}
                      roughness={0.7}
                    />
                  </mesh>
                );
              }),
            )}

            {/* Existing cubes */}
            {sortedCubes.map(cube => (
              <RoundedBox
                key={`cube-${cube.x}-${cube.y}-${cube.z}`}
                args={[0.9, 0.9, 0.9]}
                radius={0.05}
                smoothness={4}
                position={[cube.x, cube.y, cube.z]}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handleCubePointerDown(cube);
                }}
                onPointerEnter={() => {
                  if (!disabledRef.current && (draggingRef.current || selectedColor)) {
                    setHoverCell({ x: cube.x, z: cube.z });
                  }
                }}
              >
                <meshStandardMaterial
                  color={cube.color}
                  emissive={tool === 'erase' ? '#ef4444' : '#000000'}
                  emissiveIntensity={tool === 'erase' ? 0.18 : 0}
                  roughness={0.35}
                  metalness={0.08}
                />
              </RoundedBox>
            ))}

            {/* Hover preview */}
            {hoverCell && activeColor && (
              <RoundedBox
                args={[0.94, 0.94, 0.94]}
                radius={0.05}
                smoothness={3}
                position={[hoverCell.x, hoverY, hoverCell.z]}
              >
                <meshStandardMaterial
                  color={CUBE_COLOR_HEX[activeColor]}
                  transparent
                  opacity={canPreviewPlace ? 0.55 : 0.3}
                  emissive={canPreviewPlace ? '#22c55e' : '#ef4444'}
                  emissiveIntensity={0.55}
                />
              </RoundedBox>
            )}

            <OrbitControls
              target={target}
              enablePan={false}
              enableZoom={false}
              enableRotate={viewMode === 'free'}
              autoRotate={viewMode === 'free'}
              autoRotateSpeed={1.2}
            />
            </Suspense>
          </Canvas>

          {/* Direction labels (HTML overlay — robust on all devices) */}
          <div className="pointer-events-none absolute inset-0 z-[1] text-[11px] font-bold sm:text-xs">
            <span className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-slate-950/70 px-2 py-0.5 text-slate-300">뒤</span>
            <span className="absolute left-1/2 bottom-2 -translate-x-1/2 rounded-full bg-gold/20 px-2 py-0.5 text-gold">🚪 앞</span>
            <span className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-gold/20 px-2 py-0.5 text-gold">👈 왼쪽</span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/70 px-2 py-0.5 text-slate-300">오른쪽</span>
          </div>
        </ErrorBoundary>

        {/* Selected color hint */}
        {selectedColor && !draggingColor && (
          <div className="pointer-events-none absolute top-3 right-3 z-10 flex items-center gap-2 rounded-full bg-slate-950/85 px-3 py-1.5 text-xs font-bold text-white">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ background: CUBE_COLOR_HEX[selectedColor] }}
            />
            {CUBE_COLOR_LABEL[selectedColor]} 선택됨
          </div>
        )}

        {/* Erase mode hint */}
        {tool === 'erase' && (
          <div className="pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-red-500/85 px-3 py-1 text-xs font-bold text-white">
            🧽 지우개 모드
          </div>
        )}

        {/* Error toast */}
        {errorMsg && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-red-500/95 px-4 py-2 text-sm font-bold text-white shadow-lg">
            ⚠️ {errorMsg}
          </div>
        )}
      </div>

      {/* Floating drag preview (HTML, follows pointer) */}
      {draggingColor && pointerScreen && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-md"
          style={{
            left: pointerScreen.x,
            top: pointerScreen.y,
            width: 56,
            height: 56,
            background: CUBE_COLOR_HEX[draggingColor],
            border: '3px solid white',
            boxShadow: '0 8px 24px rgba(0,0,0,0.45), inset 0 -4px 0 rgba(0,0,0,0.25)',
          }}
        />
      )}

      {/* Color palette — same color can be placed many times; target shown for reference */}
      <div className="flex flex-wrap items-stretch justify-center gap-2 rounded-2xl bg-slate-900/60 px-3 py-3 sm:gap-3">
        {paletteColors.map(color => {
          const used = usedOf(cubes, color);
          const target = requiredColorCount?.[color];
          const isSelected = selectedColor === color;
          const isDragging = draggingColor === color;
          const matchesTarget = target !== undefined && used === target;
          return (
            <button
              key={color}
              type="button"
              onPointerDown={(e) => handlePalettePointerDown(color, e)}
              onKeyDown={(e) => handlePaletteKeyDown(color, e)}
              disabled={disabled}
              aria-label={`${CUBE_COLOR_LABEL[color]} 큐브 ${used}개 사용${target !== undefined ? `, 목표 ${target}개` : ''}`}
              aria-pressed={isSelected}
              className={[
                'flex min-w-[70px] flex-col items-center gap-1 rounded-2xl border-2 px-3 py-2 transition-all select-none',
                isSelected
                  ? 'border-gold ring-2 ring-gold/60'
                  : isDragging
                    ? 'scale-95 border-white/60'
                    : 'border-white/15',
                disabled
                  ? 'cursor-not-allowed opacity-40'
                  : 'cursor-grab hover:scale-105 hover:border-white/40 active:cursor-grabbing',
              ].join(' ')}
              style={{ background: 'rgba(15,23,42,0.85)', touchAction: 'none' }}
            >
              <span
                className="h-9 w-9 rounded-md"
                style={{
                  background: CUBE_COLOR_HEX[color],
                  boxShadow:
                    'inset 0 -3px 0 rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.3)',
                }}
              />
              <span className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-white">×{used}</span>
                {target !== undefined && (
                  <span className={`text-[10px] font-bold ${matchesTarget ? 'text-emerald-300' : 'text-white/55'}`}>
                    /{target}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* View buttons */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {([
          ['front', '👀 앞에서'],
          ['top', '☁️ 위에서'],
          ['left', '👈 왼쪽에서'],
          ['free', '🔄 자유롭게'],
        ] as const).map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            aria-pressed={viewMode === mode}
            className={`rounded-full px-3 py-2 text-xs font-bold sm:text-sm ${viewMode === mode ? 'bg-gold text-navy' : 'bg-slate-800 text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
