import { useState, useEffect } from 'react';
import { Scene3D } from './components/3d/Scene3D';
import { HUD } from './components/ui/HUD';
import { Onboarding } from './components/ui/Onboarding';
import { useDepthOSStore } from './stores/depthOSStore';

function App() {
  const {
    settings,
    isFocused,
    saveWorkspace,
    cycleApps,
    unfocusApp,
    toggleMinimap,
    toggleHelp,
    toggleSettings,
    workspaces,
    activeWorkspaceId,
  } = useDepthOSStore();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl+S to save workspace
      if (e.ctrlKey && e.code === 'KeyS') {
        e.preventDefault();
        saveWorkspace();
      }

      // Tab to cycle apps
      if (e.code === 'Tab' && !isFocused) {
        e.preventDefault();
        cycleApps('next');
      }

      // Escape to unfocus
      if (e.code === 'Escape' && isFocused) {
        unfocusApp();
      }

      // M for minimap
      if (e.code === 'KeyM') {
        toggleMinimap();
      }

      // ? for help
      if (e.code === 'Slash' && e.shiftKey) {
        toggleHelp();
      }

      // , for settings
      if (e.code === 'Comma') {
        toggleSettings();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    saveWorkspace,
    isFocused,
    cycleApps,
    unfocusApp,
    toggleMinimap,
    toggleHelp,
    toggleSettings,
  ]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      {/* 3D Scene */}
      <Scene3D showStats={false} />

      {/* HUD Overlay */}
      <HUD />

      {/* Onboarding Tutorial */}
      <Onboarding />

      {/* Loading overlay for initial load */}
      <InitialLoader />
    </div>
  );
}

// Initial loading animation
const InitialLoader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => setVisible(false), 500);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 transition-opacity duration-500"
      style={{ opacity }}
    >
      <div className="relative">
        {/* Logo */}
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse">
          DEPTH OS
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-center mt-4">
          A 3D Immersive Desktop Environment
        </p>

        {/* Loading bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full mt-8 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-progress" />
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
