import { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Environment3D } from './Environment3D';
import { AppWindow3D } from './AppWindow3D';
import { CameraController } from './CameraController';
import { Clock3D } from './Clock3D';
import { WeatherWidget3D, SystemWidget3D, CalendarWidget3D, NotesWidget3D } from './EnhancedWidgets';
import { FPSCounter } from './PostProcessing';
import { useDepthOSStore } from '../../stores/depthOSStore';
import * as THREE from 'three';

interface Scene3DProps {
  showStats?: boolean;
}

const LoadingFallback = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  );
};

// Audio listener component to attach to the camera
const AudioListener = () => {
  const { camera } = useThree();
  const [listener] = useState(() => new THREE.AudioListener());
  
  useEffect(() => {
    camera.add(listener);
    return () => {
      camera.remove(listener);
    };
  }, [camera, listener]);
  
  return null;
};

const MiniMap: React.FC = () => {
  const { workspaces, activeWorkspaceId, settings, selectApp } = useDepthOSStore();
  const workspace = workspaces.find((w) => w.id === activeWorkspaceId);

  if (!settings.showMinimap || !workspace) return null;

  const handleAppClick = (appId: string) => {
    selectApp(appId);
  };

  return (
    <div className="absolute bottom-4 right-4 w-56 h-56 bg-black/60 rounded-xl border border-white/20 overflow-hidden backdrop-blur-sm">
      <div className="w-full h-full relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-800/80" />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="75" r="4" fill="#22c55e" className="animate-pulse" />
          <line x1="50" y1="75" x2="50" y2="50" stroke="#22c55e" strokeWidth="1" opacity="0.5" />

          {(workspace.apps || []).map((app) => {
            const mapX = 50 + (app.position.x / 15) * 45;
            const mapY = 75 - (app.position.z / 15) * 45 + (app.position.y / 10) * 15;
            return (
              <g key={app.id} onClick={() => handleAppClick(app.id)} className="cursor-pointer">
                <circle
                  cx={mapX}
                  cy={mapY}
                  r={app.isFocused ? 5 : 4}
                  fill={app.color}
                  opacity={app.isMinimized ? 0.4 : 1}
                  stroke={app.pinned ? '#fbbf24' : 'transparent'}
                  strokeWidth="1"
                />
                <text x={mapX} y={mapY + 8} fontSize="3.5" fill="white" textAnchor="middle" pointerEvents="none">
                  {app.name.substring(0, 5)}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-1 left-2 text-[9px] text-gray-400 flex items-center gap-1">
          <span>Mini Map</span>
          <span className="text-gray-600">•</span>
          <span>{(workspace.apps || []).length} apps</span>
        </div>
      </div>
    </div>
  );
};

const WidgetRenderer: React.FC<{ widget: any }> = ({ widget }) => {
  switch (widget.type) {
    case 'clock':
      return <Clock3D key={widget.id} widget={widget} />;
    case 'weather':
      return <WeatherWidget3D key={widget.id} widget={widget} />;
    case 'system':
      return <SystemWidget3D key={widget.id} widget={widget} />;
    case 'calendar':
      return <CalendarWidget3D key={widget.id} widget={widget} />;
    case 'notes':
      return <NotesWidget3D key={widget.id} widget={widget} />;
    default:
      return null;
  }
};

export const Scene3D: React.FC<Scene3DProps> = () => {
  // Select specific state to minimize re-renders
  const currentEnvironment = useDepthOSStore(state => state.currentEnvironment);
  const workspaces = useDepthOSStore(state => state.workspaces);
  const activeWorkspaceId = useDepthOSStore(state => state.activeWorkspaceId);
  const settings = useDepthOSStore(state => state.settings);
  const isFocused = useDepthOSStore(state => state.isFocused);
  const updateSystemInfo = useDepthOSStore(state => state.updateSystemInfo);
  const refreshWeather = useDepthOSStore(state => state.refreshWeather);

  const workspace = workspaces.find((w) => w.id === activeWorkspaceId);

  useEffect(() => {
    const interval = setInterval(() => {
      updateSystemInfo({
        cpuUsage: Math.random() * 100,
        memoryUsage: 40 + Math.random() * 30,
        gpuUsage: Math.random() * 80,
        networkSpeed: Math.random() * 100,
        temperature: 40 + Math.random() * 20,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [updateSystemInfo]);

  useEffect(() => {
    refreshWeather();
  }, [refreshWeather]);

  const dpr = settings.quality === 'ultra' ? 2 : settings.quality === 'high' ? [1, 2] : settings.quality === 'medium' ? [1, 1.5] : 1;

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows={settings.enableShadows}
        camera={{ fov: settings.fov || 75, near: 0.1, far: 1000, position: [0, 2, 8] }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={dpr}
      >
        <AudioListener />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Suspense fallback={<LoadingFallback />}>
          {currentEnvironment && <Environment3D environment={currentEnvironment} />}

          {(workspace?.apps ?? []).map((app) => (
            <AppWindow3D key={app.id} app={app} />
          ))}

          {settings.showWidgets && (workspace?.widgets ?? []).map((widget) => (
            <WidgetRenderer key={widget.id} widget={widget} />
          ))}

          <CameraController enabled={!isFocused} />
          
          {/* PostProcessing and PointerLockControls disabled for stability */}
        </Suspense>
      </Canvas>

      <MiniMap />

      {isFocused && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 rounded-lg border border-white/20 backdrop-blur-sm">
          <span className="text-white text-sm">Focus Mode — Press ESC to exit</span>
        </div>
      )}

      {settings.showFPS && <FPSCounter />}
    </div>
  );
};
