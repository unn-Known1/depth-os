import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useDepthOSStore } from '../../stores/depthOSStore';

interface CameraControllerProps {
  enabled?: boolean;
}

// Flight-style camera controller
export const CameraController: React.FC<CameraControllerProps> = ({
  enabled = true,
}) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);

  const { keyboard, settings, isFocused, focusedAppId, workspaces, activeWorkspaceId } =
    useDepthOSStore();

  // Focus target for smooth transition
  const focusTargetRef = useRef(new THREE.Vector3(0, 2, 0));
  const isTransitioningRef = useRef(false);

  // Movement speed based on settings
  const getSpeed = useCallback(() => {
    const baseSpeed = 0.15;
    const sprintMultiplier = keyboard.sprint ? 2 : 1;
    const sensitivity = settings.mouseSensitivity;
    return baseSpeed * sensitivity * sprintMultiplier;
  }, [keyboard.sprint, settings.mouseSensitivity]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enabled || isFocused) return;

      switch (e.code) {
        case 'KeyW':
          useDepthOSStore.getState().updateKeyboard({ forward: true });
          break;
        case 'KeyS':
          useDepthOSStore.getState().updateKeyboard({ backward: true });
          break;
        case 'KeyA':
          useDepthOSStore.getState().updateKeyboard({ left: true });
          break;
        case 'KeyD':
          useDepthOSStore.getState().updateKeyboard({ right: true });
          break;
        case 'Space':
          useDepthOSStore.getState().updateKeyboard({ up: true });
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          useDepthOSStore.getState().updateKeyboard({ sprint: true });
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          useDepthOSStore.getState().updateKeyboard({ forward: false });
          break;
        case 'KeyS':
          useDepthOSStore.getState().updateKeyboard({ backward: false });
          break;
        case 'KeyA':
          useDepthOSStore.getState().updateKeyboard({ left: false });
          break;
        case 'KeyD':
          useDepthOSStore.getState().updateKeyboard({ right: false });
          break;
        case 'Space':
          useDepthOSStore.getState().updateKeyboard({ up: false });
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          useDepthOSStore.getState().updateKeyboard({ sprint: false });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, isFocused]);

  // Handle focus transition
  useEffect(() => {
    if (isFocused && focusedAppId) {
      const workspace = workspaces.find((w) => w.id === activeWorkspaceId);
      const app = workspace?.apps.find((a) => a.id === focusedAppId);

      if (app) {
        isTransitioningRef.current = true;
        focusTargetRef.current.set(app.position.x, app.position.y, app.position.z + 3);
      }
    } else {
      isTransitioningRef.current = false;
      focusTargetRef.current.set(0, 2, 8);
    }
  }, [isFocused, focusedAppId, workspaces, activeWorkspaceId]);

  // Update camera each frame
  useFrame(() => {
    if (!enabled) return;

    const speed = getSpeed();

    // Get camera direction
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();

    // Handle movement
    if (!isFocused) {
      if (keyboard.forward) {
        camera.position.addScaledVector(direction, speed);
      }
      if (keyboard.backward) {
        camera.position.addScaledVector(direction, -speed);
      }
      if (keyboard.left) {
        camera.position.addScaledVector(right, -speed);
      }
      if (keyboard.right) {
        camera.position.addScaledVector(right, speed);
      }
      if (keyboard.up) {
        camera.position.y += speed;
      }
      if (keyboard.down) {
        camera.position.y -= speed;
      }

      // Apply FOV
      camera.fov = settings.fov;
      camera.updateProjectionMatrix();
    } else {
      // Smooth transition to focused app
      const targetPos = new THREE.Vector3();
      targetPos.copy(focusTargetRef.current);

      camera.position.lerp(targetPos, 0.05);

      // Look at the focused app
      const workspace = workspaces.find((w) => w.id === activeWorkspaceId);
      const app = workspace?.apps.find((a) => a.id === focusedAppId);

      if (app) {
        const lookTarget = new THREE.Vector3(
          app.position.x,
          app.position.y,
          app.position.z
        );
        camera.lookAt(lookTarget);
      }
    }

    // REMOVED: Periodic store update to avoid global re-renders
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled && !isFocused}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={2}
      maxDistance={50}
      maxPolarAngle={Math.PI / 2 + 0.1}
      minPolarAngle={0}
      target={[0, 2, 0]}
      domElement={gl.domElement}
    />
  );
};
