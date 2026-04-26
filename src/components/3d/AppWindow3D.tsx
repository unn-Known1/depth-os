import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { AppInstance } from '../../types';
import { useDepthOSStore } from '../../stores/depthOSStore';

interface AppWindow3DProps {
  app: AppInstance;
}

// App window content renderer
const AppContent: React.FC<{ app: AppInstance }> = ({ app }) => {
  const [loading, setLoading] = useState(true);

  // If the app has a URL and is an iframe type, render real content
  if (app.contentType === 'iframe' && app.url) {
    return (
      <group>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[app.scale.x, app.scale.y]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        
        {loading && (
          <Text position={[0, 0, 0.03]} fontSize={0.1} color="white">
            Loading {app.name}...
          </Text>
        )}

        <Html
          transform
          occlude
          distanceFactor={1}
          position={[0, 0, 0.02]}
          style={{
            width: `${app.scale.x * 400}px`,
            height: `${app.scale.y * 400}px`,
            background: 'white',
            border: 'none',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <iframe
              src={app.url}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              onLoad={() => setLoading(false)}
              title={app.name}
            />
            {/* Warning for blocked sites */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              fontSize: '10px',
              padding: '4px',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              Note: Some sites block 3D embedding.
            </div>
          </div>
        </Html>
      </group>
    );
  }

  // Generate mock content based on app type
  const content = {
    Browser: (
      <group>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[app.scale.x, app.scale.y]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, app.scale.y / 2 - 0.1, 0.02]}>
          <planeGeometry args={[app.scale.x - 0.2, 0.15]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[0, app.scale.y / 2 - 0.4 - i * 0.15, 0.02]}>
            <planeGeometry args={[app.scale.x - 0.4, 0.05]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        ))}
      </group>
    ),
    Terminal: (
      <group>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[app.scale.x, app.scale.y]} />
          <meshStandardMaterial color="#0d1117" />
        </mesh>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[-app.scale.x / 2 + 0.5, app.scale.y / 2 - 0.2 - i * 0.15, 0.02]}>
            <planeGeometry args={[0.8 + Math.random() * 0.8, 0.06]} />
            <meshStandardMaterial color={i === 0 ? '#22c55e' : '#22c55e'} />
          </mesh>
        ))}
      </group>
    ),
  };

  return content[app.name as keyof typeof content] || (
    <group>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[app.scale.x, app.scale.y]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.2}
        color="white"
      >
        {app.name}
      </Text>
    </group>
  );
};

export const AppWindow3D: React.FC<AppWindow3DProps> = ({ app }) => {
  const meshRef = useRef<THREE.Group>(null);
  const { 
    focusApp, 
    unfocusApp, 
    isFocused, 
    focusedAppId, 
    removeApp, 
    moveApp,
    updateApp
  } = useDepthOSStore();
  
  const [hovered, setHovered] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const { camera, raycaster, mouse } = useThree();
  const dragOffset = useRef(new THREE.Vector3());

  const isThisFocused = focusedAppId === app.id && isFocused;

  // Handle interactions
  useFrame((state) => {
    if (meshRef.current && app.position && !dragging && !resizing) {
      if (!isThisFocused) {
        meshRef.current.position.y =
          app.position.y + Math.sin(state.clock.elapsedTime * 0.5 + app.position.x) * 0.05;
      }
      
      const targetScale = hovered === 'window' ? 1.02 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    // Dragging logic
    if (dragging && meshRef.current) {
      raycaster.setFromCamera(mouse, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -app.position.z);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, target);
      
      if (target) {
        const newPos = target.sub(dragOffset.current);
        meshRef.current.position.set(newPos.x, newPos.y, app.position.z);
      }
    }

    // Resizing logic
    if (resizing && meshRef.current) {
      raycaster.setFromCamera(mouse, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -app.position.z);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, target);
      
      if (target) {
        // Calculate new scale based on distance from window center
        const newWidth = Math.max(1.5, Math.abs(target.x - app.position.x) * 2);
        const newHeight = Math.max(1, Math.abs(target.y - app.position.y) * 2);
        
        // Use updateApp for immediate visual feedback
        updateApp(app.id, { scale: { x: newWidth, y: newHeight, z: app.scale.z } });
      }
    }
  });

  const handleDragStart = (e: any) => {
    e.stopPropagation();
    if (isThisFocused) return;
    
    setDragging(true);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -app.position.z);
    const target = new THREE.Vector3();
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, target);
    dragOffset.current.copy(target).sub(new THREE.Vector3(app.position.x, app.position.y, app.position.z));
    
    const handleDragEnd = () => {
      setDragging(false);
      if (meshRef.current) {
        moveApp(app.id, {
          x: meshRef.current.position.x,
          y: meshRef.current.position.y,
          z: app.position.z
        });
      }
      window.removeEventListener('mouseup', handleDragEnd);
    };
    window.addEventListener('mouseup', handleDragEnd);
  };

  const handleResizeStart = (e: any) => {
    e.stopPropagation();
    setResizing(true);
    
    const handleResizeEnd = () => {
      setResizing(false);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
    window.addEventListener('mouseup', handleResizeEnd);
  };

  const handleClose = (e: any) => {
    e.stopPropagation();
    removeApp(app.id);
  };

  const handleFocus = (e: any) => {
    e.stopPropagation();
    if (isThisFocused) {
      unfocusApp();
    } else {
      focusApp(app.id);
    }
  };

  const handleOpenExternal = (e: any) => {
    e.stopPropagation();
    if (app.url) {
      window.open(app.url, '_blank');
    }
  };

  if (!app.position || !app.scale) return null;

  return (
    <group
      ref={meshRef}
      position={[app.position.x, app.position.y, app.position.z]}
      rotation={[app.rotation?.x || 0, app.rotation?.y || 0, app.rotation?.z || 0]}
    >
      {/* Window Title Bar (Drag area) */}
      <mesh 
        position={[0, app.scale.y / 2 + 0.1, 0]}
        onPointerDown={handleDragStart}
        onPointerOver={() => setHovered('titlebar')}
        onPointerOut={() => setHovered(null)}
      >
        <boxGeometry args={[app.scale.x + 0.1, 0.2, app.scale.z]} />
        <meshStandardMaterial 
          color={app.color} 
          metalness={0.8} 
          roughness={0.2}
          emissive={hovered === 'titlebar' ? app.color : '#000000'}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Close Button */}
      <group 
        position={[app.scale.x / 2 - 0.1, app.scale.y / 2 + 0.1, app.scale.z / 2 + 0.01]}
        onClick={handleClose}
        onPointerOver={() => setHovered('close')}
        onPointerOut={() => setHovered(null)}
      >
        <mesh>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color={hovered === 'close' ? '#ff0000' : '#ff5f57'} />
        </mesh>
        <Text position={[0, 0, 0.01]} fontSize={0.08} color="white">×</Text>
      </group>

      {/* External Link Button (New) */}
      {app.url && (
        <group 
          position={[app.scale.x / 2 - 0.3, app.scale.y / 2 + 0.1, app.scale.z / 2 + 0.01]}
          onClick={handleOpenExternal}
          onPointerOver={() => setHovered('external')}
          onPointerOut={() => setHovered(null)}
        >
          <mesh>
            <circleGeometry args={[0.07, 16]} />
            <meshBasicMaterial color={hovered === 'external' ? '#ffffff' : '#3b82f6'} />
          </mesh>
          <Text position={[0, 0, 0.01]} fontSize={0.05} color="black">↗</Text>
        </group>
      )}

      {/* Main Window Frame */}
      <mesh 
        castShadow 
        receiveShadow
        onClick={handleFocus}
        onPointerOver={() => setHovered('window')}
        onPointerOut={() => setHovered(null)}
      >
        <boxGeometry args={[app.scale.x + 0.1, app.scale.y + 0.1, app.scale.z]} />
        <meshStandardMaterial
          color={app.color}
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={app.isMinimized ? 0.2 : 1}
          emissive={isThisFocused ? app.color : '#000000'}
          emissiveIntensity={isThisFocused ? 0.3 : 0}
        />
      </mesh>

      {/* Resize Handle (Bottom Right) */}
      <mesh 
        position={[app.scale.x / 2, -app.scale.y / 2, app.scale.z / 2 + 0.01]}
        onPointerDown={handleResizeStart}
        onPointerOver={() => setHovered('resize')}
        onPointerOut={() => setHovered(null)}
      >
        <boxGeometry args={[0.15, 0.15, 0.05]} />
        <meshStandardMaterial color={hovered === 'resize' ? '#ffffff' : app.color} />
      </mesh>

      {/* Window content */}
      {!app.isMinimized && (
        <group position={[0, 0, app.scale.z / 2 + 0.01]}>
          <AppContent app={app} />
        </group>
      )}

      {/* Title Text */}
      <Text
        position={[-(app.scale.x / 2 - 0.2), app.scale.y / 2 + 0.1, app.scale.z / 2 + 0.01]}
        fontSize={0.08}
        color="white"
        anchorX="left"
      >
        {app.name}
      </Text>

      {/* Focus Indicator */}
      {isThisFocused && (
        <group position={[0, 0, 0]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(app.scale.x + 0.2, app.scale.y + 0.4, app.scale.z + 0.1)]} />
            <lineBasicMaterial color="white" transparent opacity={0.5} />
          </lineSegments>
        </group>
      )}
    </group>
  );
};
