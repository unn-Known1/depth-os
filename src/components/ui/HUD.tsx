import { useState, useEffect } from 'react';
import { useDepthOSStore } from '../../stores/depthOSStore';
import { themeConfigs, getAllThemes } from '../../utils/themes';
import type { EnvironmentTheme, QualityLevel } from '../../types';
import {
  Settings,
  HelpCircle,
  Map,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  Monitor,
  Eye,
  EyeOff,
  Gauge,
  Layers,
  Save,
  RotateCcw,
} from 'lucide-react';
import { AppDrawer } from './AppDrawer';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

export const HUD: React.FC = () => {
  const {
    settings,
    updateSettings,
    toggleSettings,
    toggleHelp,
    toggleMinimap,
    minimapOpen,
    helpOpen,
    settingsOpen,
    currentTheme,
    saveWorkspace,
    resetWorkspace,
  } = useDepthOSStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{ text: string, type: 'success' | 'info' } | null>(null);

  const theme = themeConfigs[currentTheme];

  const handleSave = () => {
    saveWorkspace();
    setNotification({ text: 'Workspace saved!', type: 'success' });
    setTimeout(() => setNotification(null), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Reset this workspace to its default state? This will remove all custom apps and reset layout.')) {
      resetWorkspace();
      setNotification({ text: 'Workspace reset!', type: 'info' });
      setTimeout(() => setNotification(null), 2000);
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between px-4 z-10">
        {/* Left: Logo and workspace switcher */}
        <div className="flex items-center gap-4">
          <h1 className="text-white text-xl font-bold tracking-wider flex items-center gap-2">
            <Monitor size={24} className="text-indigo-400" />
            DEPTH OS
          </h1>
          <WorkspaceSwitcher />
        </div>

        {/* Center: Notifications */}
        {notification && (
          <div className={`absolute left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-white text-sm animate-pulse ${
            notification.type === 'success' ? 'bg-green-500/90' : 'bg-blue-500/90'
          }`}>
            {notification.text}
          </div>
        )}

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* App Drawer */}
          <button
            onClick={() => useDepthOSStore.getState().toggleAppDrawer()}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="App Drawer (Launch apps)"
          >
            <Grid3X3 size={18} />
          </button>

          <button
            onClick={handleSave}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Save Workspace (Ctrl+S)"
          >
            <Save size={18} />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Reset Workspace"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={toggleMinimap}
            className={`p-2 rounded-lg transition-colors ${
              minimapOpen ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
            title="Toggle Mini Map (M)"
          >
            <Map size={18} />
          </button>

          <button
            onClick={toggleHelp}
            className={`p-2 rounded-lg transition-colors ${
              helpOpen ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
            title="Help (?)"
          >
            <HelpCircle size={18} />
          </button>

          <button
            onClick={toggleSettings}
            className={`p-2 rounded-lg transition-colors ${
              settingsOpen ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Bottom dock */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-4 flex flex-col items-center gap-2 z-10">
        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Dock */}
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-6 py-3 bg-black/70 backdrop-blur-xl rounded-2xl border border-white/20">
            {/* Theme selector */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm text-white"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.uiColors.primary }}
                />
                <span>{theme.name}</span>
              </button>

              {isThemeMenuOpen && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-black/90 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                  {getAllThemes().map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        useDepthOSStore.getState().setTheme(t.id as EnvironmentTheme);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors ${
                        currentTheme === t.id ? 'bg-white/10' : ''
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: t.uiColors.primary }}
                      />
                      <div className="text-left">
                        <p className="text-white text-sm">{t.name}</p>
                        <p className="text-gray-400 text-xs">{t.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-white/20" />

            {/* Widgets toggle */}
            <button
              onClick={() => updateSettings({ showWidgets: !settings.showWidgets })}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              title="Toggle Widgets"
            >
              {settings.showWidgets ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>

            {/* Volume control */}
            <button
              onClick={() => updateSettings({ ambientVolume: settings.ambientVolume > 0 ? 0 : 0.5 })}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              title="Toggle Sound"
            >
              {settings.ambientVolume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* UI Theme toggle */}
            <button
              onClick={() =>
                updateSettings({
                  uiTheme: settings.uiTheme === 'dark' ? 'light' : 'dark',
                })
              }
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              title="Toggle UI Theme"
            >
              {settings.uiTheme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* FPS toggle */}
            <button
              onClick={() => updateSettings({ showFPS: !settings.showFPS })}
              className={`p-2 rounded-lg transition-colors ${
                settings.showFPS ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-gray-400'
              }`}
              title="Toggle FPS Counter"
            >
              <Gauge size={18} />
            </button>
          </div>
        )}
      </div>

      {/* App Drawer */}
      <AppDrawer />

      {/* Settings Panel */}
      {settingsOpen && <SettingsPanel />}

      {/* Help Panel */}
      {helpOpen && <HelpPanel />}
    </>
  );
};

// Settings Panel Component
const SettingsPanel: React.FC = () => {
  const {
    settings,
    updateSettings,
    setQuality,
    resetSettings,
    toggleSettings,
    currentTheme,
  } = useDepthOSStore();

  const qualityLevels: QualityLevel[] = ['low', 'medium', 'high', 'ultra'];

  return (
    <div className="absolute top-16 right-4 w-96 bg-black/80 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden z-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Settings size={18} />
          Settings
        </h2>
        <div className="flex gap-2">
          <button
            onClick={resetSettings}
            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Reset to defaults"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={toggleSettings}
            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Quality */}
        <div className="space-y-3">
          <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
            <Gauge size={16} />
            Performance Quality
          </label>
          <div className="grid grid-cols-4 gap-2">
            {qualityLevels.map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`py-2 rounded-lg text-sm capitalize transition-colors ${
                  settings.quality === q
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-3">
          <label className="text-gray-300 text-sm font-medium">Environment Theme</label>
          <div className="grid grid-cols-3 gap-2">
            {getAllThemes().map((theme) => (
              <button
                key={theme.id}
                onClick={() => useDepthOSStore.getState().setTheme(theme.id as EnvironmentTheme)}
                className={`p-3 rounded-lg border transition-all ${
                  currentTheme === theme.id
                    ? 'border-white/50 bg-white/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div
                  className="w-full h-8 rounded mb-2"
                  style={{ background: `linear-gradient(135deg, ${theme.uiColors.primary}, ${theme.uiColors.secondary})` }}
                />
                <span className="text-xs text-white">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FOV */}
        <div className="space-y-3">
          <label className="text-gray-300 text-sm font-medium">
            Field of View: {settings.fov}°
          </label>
          <input
            type="range"
            min="60"
            max="120"
            value={settings.fov}
            onChange={(e) => updateSettings({ fov: Number(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Mouse Sensitivity */}
        <div className="space-y-3">
          <label className="text-gray-300 text-sm font-medium">
            Mouse Sensitivity: {settings.mouseSensitivity.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.mouseSensitivity}
            onChange={(e) => updateSettings({ mouseSensitivity: Number(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Post Processing */}
        <div className="space-y-3">
          <label className="text-gray-300 text-sm font-medium">Visual Effects</label>
          <div className="space-y-2">
            <ToggleOption
              label="Enable Post Processing"
              checked={settings.enablePostProcessing}
              onChange={(checked) => updateSettings({ enablePostProcessing: checked })}
            />
            <ToggleOption
              label="Bloom Effect"
              checked={settings.enableBloom}
              onChange={(checked) => updateSettings({ enableBloom: checked })}
              disabled={!settings.enablePostProcessing}
            />
            <ToggleOption
              label="Shadows"
              checked={settings.enableShadows}
              onChange={(checked) => updateSettings({ enableShadows: checked })}
            />
            <ToggleOption
              label="Reduced Motion"
              checked={settings.reducedMotion}
              onChange={(checked) => updateSettings({ reducedMotion: checked })}
            />
          </div>
        </div>

        {/* Display */}
        <div className="space-y-3">
          <label className="text-gray-300 text-sm font-medium">Display</label>
          <div className="space-y-2">
            <ToggleOption
              label="Show Mini-map"
              checked={settings.showMinimap}
              onChange={(checked) => updateSettings({ showMinimap: checked })}
            />
            <ToggleOption
              label="Show Widgets"
              checked={settings.showWidgets}
              onChange={(checked) => updateSettings({ showWidgets: checked })}
            />
            <ToggleOption
              label="Show FPS Counter"
              checked={settings.showFPS}
              onChange={(checked) => updateSettings({ showFPS: checked })}
            />
            <ToggleOption
              label="Auto-save Workspace"
              checked={settings.autoSave}
              onChange={(checked) => updateSettings({ autoSave: checked })}
            />
          </div>
        </div>

        {/* Ambient Volume */}
        <div className="space-y-3">
          <label className="text-gray-300 text-sm font-medium">
            Ambient Volume: {Math.round(settings.ambientVolume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.ambientVolume}
            onChange={(e) => updateSettings({ ambientVolume: Number(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

// Toggle Option Component
const ToggleOption: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ label, checked, onChange, disabled }) => (
  <label className={`flex items-center justify-between cursor-pointer ${disabled ? 'opacity-50' : ''}`}>
    <span className="text-gray-300 text-sm">{label}</span>
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`w-10 h-6 rounded-full transition-colors relative ${checked ? 'bg-indigo-500' : 'bg-white/20'}`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-5' : 'left-1'}`}
      />
    </div>
  </label>
);

// Help Panel Component
const HelpPanel: React.FC = () => {
  const { toggleHelp } = useDepthOSStore();

  const shortcuts = [
    { keys: ['W', 'A', 'S', 'D'], action: 'Move camera' },
    { keys: ['Space'], action: 'Move up' },
    { keys: ['Shift'], action: 'Move down / Sprint' },
    { keys: ['Click'], action: 'Select app' },
    { keys: ['Double-click'], action: 'Focus app' },
    { keys: ['ESC'], action: 'Exit focus mode' },
    { keys: ['Tab'], action: 'Cycle through apps' },
    { keys: ['M'], action: 'Toggle mini-map' },
    { keys: ['Ctrl', 'S'], action: 'Save workspace' },
    { keys: ['Mouse'], action: 'Look around' },
    { keys: ['Scroll'], action: 'Zoom in/out' },
    { keys: ['Right-click'], action: 'Open context menu' },
  ];

  return (
    <div className="absolute top-16 left-4 w-80 bg-black/80 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden z-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <HelpCircle size={18} />
          Keyboard Shortcuts
        </h2>
        <button
          onClick={toggleHelp}
          className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
        {shortcuts.map((shortcut, i) => (
          <div key={i} className="flex items-center justify-between py-1.5">
            <div className="flex gap-1">
              {shortcut.keys.map((key, j) => (
                <kbd
                  key={j}
                  className="px-2 py-1 bg-white/10 rounded text-xs text-white font-mono"
                >
                  {key}
                </kbd>
              ))}
            </div>
            <span className="text-gray-400 text-sm">{shortcut.action}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10 bg-white/5">
        <p className="text-gray-400 text-xs text-center">
          Click on an app window to select it. Double-click to focus.
        </p>
      </div>
    </div>
  );
};
