import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Environment } from '../../types';

interface Environment3DProps {
  environment: Environment;
}

// Starfield component for cosmic theme
const Starfield = () => {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.5}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

// Nebula clouds for cosmic theme
const NebulaCloud = ({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 32, 32);
    const positions = geo.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const noise = (Math.random() - 0.5) * 0.3;
      positions.setX(i, positions.getX(i) + noise);
      positions.setY(i, positions.getY(i) + noise);
      positions.setZ(i, positions.getZ(i) + noise);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Ground plane with grid
const Ground = ({ color }: { color: string }) => {
  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color={color}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Grid overlay */}
      <gridHelper
        args={[100, 50, '#333355', '#222244']}
        position={[0, 0.01, 0]}
      />
    </group>
  );
};

// Floating platforms
const FloatingPlatform = ({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.6}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

// Zen garden elements
const ZenGarden = () => {
  return (
    <group>
      {/* Stone arrangements */}
      {[
        [-3, 0.2, -3],
        [3, 0.15, -2],
        [-2, 0.25, 2],
        [4, 0.18, 3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <dodecahedronGeometry args={[0.3 + i * 0.05, 0]} />
          <meshStandardMaterial color="#555555" roughness={0.9} />
        </mesh>
      ))}

      {/* Zen sand pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[2, 3, 32]} />
        <meshBasicMaterial color="#d4c4a8" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

// Cyberpunk elements
const CyberpunkElements = () => {
  const neonSigns = useMemo(
    () => [
      { position: [-8, 4, -10], color: '#ff00ff' },
      { position: [8, 5, -12], color: '#00ffff' },
      { position: [0, 6, -15], color: '#ff0000' },
    ],
    []
  );

  return (
    <group>
      {/* Neon signs */}
      {neonSigns.map((sign, i) => (
        <group key={i} position={sign.position}>
          <mesh>
            <boxGeometry args={[2, 0.5, 0.1]} />
            <meshBasicMaterial color={sign.color} />
          </mesh>
          <pointLight color={sign.color} intensity={2} distance={5} />
        </group>
      ))}

      {/* City buildings silhouette */}
      {[
        [-15, 5, -20],
        [-10, 8, -25],
        [-5, 6, -22],
        [0, 10, -30],
        [5, 7, -28],
        [10, 9, -25],
        [15, 6, -20],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[3, pos[1] * 2, 3]} />
          <meshStandardMaterial
            color="#111111"
            emissive="#000011"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

export const Environment3D: React.FC<Environment3DProps> = ({ environment }) => {
  // Select environment-specific elements
  const showStarfield = environment.id === 'cosmic';
  const showZenGarden = environment.id === 'zen';
  const showCyberpunk = environment.id === 'cyberpunk';

  return (
    <group>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color={environment.ambientColor} />

      {/* Main directional light */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        color={environment.lightColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Fill light */}
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#6366f1" />

      {/* Ground */}
      <Ground color={environment.groundColor} />

      {/* Environment-specific elements */}
      {showStarfield && <Starfield />}
      {showStarfield && (
        <>
          <NebulaCloud position={[20, 10, -30]} scale={15} color="#8b5cf6" />
          <NebulaCloud position={[-25, 15, -40]} scale={20} color="#6366f1" />
        </>
      )}

      {showZenGarden && <ZenGarden />}

      {showCyberpunk && <CyberpunkElements />}

      {/* Floating platforms for all themes */}
      <FloatingPlatform position={[-6, 2, -4]} size={[4, 0.3, 4]} color="#4f46e5" />
      <FloatingPlatform position={[6, 3, -6]} size={[3, 0.3, 3]} color="#7c3aed" />
      <FloatingPlatform position={[0, 4, -8]} size={[5, 0.3, 5]} color="#8b5cf6" />

      {/* Fog for depth */}
      <fog attach="fog" args={[environment.fogColor, 20, 80]} />
    </group>
  );
};
