import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Widget } from '../../types';

interface Clock3DProps {
  widget: Widget;
}

export const Clock3D: React.FC<Clock3DProps> = ({ widget }) => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useFrame(() => {
    const now = new Date();
    timeRef.current = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
  });

  const formatTime = () => {
    const { hours, minutes, seconds } = timeRef.current;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <group
      ref={groupRef}
      position={[
        widget.position.x,
        widget.position.y,
        widget.position.z,
      ]}
    >
      {/* Background */}
      <mesh>
        <planeGeometry
          args={[widget.scale.x, widget.scale.y]}
        />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Border glow */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry
          args={[
            widget.scale.x + 0.02,
            widget.scale.y + 0.02,
          ]}
        />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.3} />
      </mesh>

      {/* Time display */}
      <Text
        position={[0, 0.15, 0.02]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {formatTime()}
      </Text>

      {/* Date display */}
      <Text
        position={[0, -0.1, 0.02]}
        fontSize={0.12}
        color="#a0aec0"
        anchorX="center"
        anchorY="middle"
      >
        {formatDate()}
      </Text>
    </group>
  );
};
