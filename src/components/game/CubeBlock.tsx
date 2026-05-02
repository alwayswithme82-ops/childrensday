import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import type { Mesh } from 'three';
import type { CubeData } from '../../types/game';

interface Props {
  cube: CubeData;
  index: number;
}

export function CubeBlock({ cube, index }: Props) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { scale, posY } = useSpring({
    scale: hovered ? 1.12 : 1,
    posY: cube.y + (hovered ? 0.08 : 0),
    config: { tension: 280, friction: 22 },
    delay: index * 40,
    from: { posY: cube.y + 2, scale: 0 },
  });

  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position-x={cube.x}
      position-y={posY}
      position-z={cube.z}
      scale={scale}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial
        color={cube.color}
        emissive={hovered ? cube.color : '#000000'}
        emissiveIntensity={hovered ? 0.3 : 0}
        roughness={0.3}
        metalness={0.1}
      />
    </animated.mesh>
  );
}
