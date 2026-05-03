import { useState } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { RoundedBox, Edges } from '@react-three/drei';

interface Props {
  position: [number, number, number];
  color: string;
  delay?: number;
}

export function CubeBlock({ position, color, delay = 0 }: Props) {
  const [hovered, setHovered] = useState(false);

  const { scale, posY } = useSpring({
    from: { scale: 0, posY: position[1] - 3 },
    to: { scale: 1, posY: position[1] },
    config: { tension: 200, friction: 18 },
    delay,
  });

  return (
    <animated.group
      position-x={position[0]}
      position-y={posY}
      position-z={position[2]}
      scale={scale}
    >
      <RoundedBox
        args={[0.95, 0.95, 0.95]}
        radius={0.05}
        smoothness={4}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.35 : 0}
          roughness={0.35}
          metalness={0.1}
        />
        <Edges color="#000000" threshold={15} />
      </RoundedBox>
    </animated.group>
  );
}
