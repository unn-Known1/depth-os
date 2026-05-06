import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Workspace,
  AppInstance,
  Environment,
  EnvironmentTheme,
  AppSettings,
  CameraState,
  KeyboardState,
  Widget,
  SystemInfo,
  WeatherData,
  MarketplaceApp,
  PostProcessingSettings,
  QualityLevel,
} from '../types';
import { environments, themeConfigs } from '../utils/themes';

const defaultCameraState: CameraState = {
  position: { x: 0, y: 2, z: 8 },
  rotation: { x: 0, y: 0, z: 0, w: 1 },
  fov: 75,
};

const defaultKeyboardState: KeyboardState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  up: false,
  down: false,
  sprint: false,
};

const defaultSettings: AppSettings = {
  theme: 'cosmic',
  uiTheme: 'dark',
  quality: 'high',
  fov: 75,
  mouseSensitivity: 1.0,
  showMinimap: true,
  showWidgets: true,
  reducedMotion: false,
  enablePostProcessing: true,
  enableBloom: true,
  enableSSAO: true,
  enableDOF: false,
  enableShadows: true,
  autoSave: true,
  showFPS: false,
  ambientVolume: 0.5,
  gridSnapping: true,
};

const defaultPostProcessing: PostProcessingSettings = {
  bloom: { intensity: 0.5, threshold: 0.9, smoothing: 0.3 },
  ssao: { radius: 0.5, intensity: 0.5 },
  dof: { focusDistance: 0.01, focalLength: 0.05, bokehScale: 2 },
};

const defaultSystemInfo: SystemInfo = {
  cpuUsage: 0,
  memoryUsage: 0,
  gpuUsage: 0,
  networkSpeed: 0,
  batteryLevel: 100,
  temperature: 45,
};

const createDefaultWorkspace = (): Workspace => ({
  id: 'default',
  name: 'Main Workspace',
  environmentId: 'cosmic',
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
  apps: [
    {
      id: 'app-1',
      name: 'Browser',
      icon: '🌐',
      color: '#4299e1',
      position: { x: -4, y: 2, z: -2 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 3, y: 2, z: 0.1 },
      zoneId: null,
      pinned: false,
      opacity: 1,
      isFocused: false,
      isMinimized: false,
      contentType: 'iframe',
      url: 'https://www.google.com/webhp?igu=1',
    },
    {
      id: 'app-2',
      name: 'Terminal',
      icon: '⌨️',
      color: '#48bb78',
      position: { x: 0, y: 2, z: -4 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 2.5, y: 2, z: 0.1 },
      zoneId: null,
      pinned: false,
      opacity: 1,
      isFocused: false,
      isMinimized: false,
      contentType: 'mock',
    },
    {
      id: 'app-3',
      name: 'Code Editor',
      icon: '📝',
      color: '#ed8936',
      position: { x: 4, y: 2, z: -2 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 3.5, y: 2.5, z: 0.1 },
      zoneId: null,
      pinned: false,
      opacity: 1,
      isFocused: false,
      isMinimized: false,
      contentType: 'mock',
    },
    {
      id: 'app-4',
      name: 'Music Player',
      icon: '🎵',
      color: '#9f7aea',
      position: { x: -4, y: 5, z: -4 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 2, y: 1.5, z: 0.1 },
      zoneId: null,
      pinned: false,
      opacity: 1,
      isFocused: false,
      isMinimized: false,
      contentType: 'mock',
    },
    {
      id: 'app-5',
      name: 'File Explorer',
      icon: '📁',
      color: '#f6ad55',
      position: { x: 6, y: 3, z: -6 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 2.5, y: 2, z: 0.1 },
      zoneId: null,
      pinned: false,
      opacity: 1,
      isFocused: false,
      isMinimized: false,
      contentType: 'mock',
    },
  ],
  widgets: [
    {
      id: 'widget-clock',
      type: 'clock',
      position: { x: 6, y: 5, z: -4 },
      scale: { x: 1.5, y: 0.8, z: 0.1 },
      config: {},
    },
    {
      id: 'widget-weather',
      type: 'weather',
      position: { x: -6, y: 5, z: -6 },
      scale: { x: 1.8, y: 1.2, z: 0.1 },
      config: { location: 'San Francisco' },
    },
    {
      id: 'widget-system',
      type: 'system',
      position: { x: 8, y: 6, z: -8 },
      scale: { x: 2, y: 1.5, z: 0.1 },
      config: {},
    },
  ],
  cameraState: defaultCameraState,
});

const defaultMarketplaceApps: MarketplaceApp[] = [
  { id: 'browser', name: 'Browser', icon: '🌐', color: '#4299e1', description: 'Web browser for internet access', category: 'productivity', isBuiltIn: true },
  { id: 'terminal', name: 'Terminal', icon: '⌨️', color: '#48bb78', description: 'Command line interface', category: 'development', isBuiltIn: true },
  { id: 'code-editor', name: 'Code Editor', icon: '📝', color: '#ed8936', description: 'IDE for coding', category: 'development', isBuiltIn: true },
  { id: 'music-player', name: 'Music Player', icon: '🎵', color: '#9f7aea', description: 'Media player', category: 'entertainment', isBuiltIn: true },
  { id: 'file-explorer', name: 'File Explorer', icon: '📁', color: '#f6ad55', description: 'File manager', category: 'utilities', isBuiltIn: true },
  { id: 'settings', name: 'Settings', icon: '⚙️', color: '#718096', description: 'System settings', category: 'utilities', isBuiltIn: true },
  { id: 'calculator', name: 'Calculator', icon: '🔢', color: '#38b2ac', description: 'Math calculator', category: 'utilities', isBuiltIn: true },
  { id: 'calendar', name: 'Calendar', icon: '📅', color: '#e53e3e', description: 'Calendar and events', category: 'productivity', isBuiltIn: true },
  { id: 'notepad', name: 'Notepad', icon: '📄', color: '#805ad5', description: 'Text editor', category: 'productivity', isBuiltIn: true },
  { id: 'clock', name: 'Clock', icon: '🕐', color: '#3182ce', description: 'World clock', category: 'utilities', isBuiltIn: true },
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#ff0000', description: 'Video platform', category: 'entertainment', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isBuiltIn: false },
  { id: 'gmail', name: 'Gmail', icon: '📧', color: '#ea4335', description: 'Email client', category: 'communication', url: 'https://mail.google.com', isBuiltIn: false },
  { id: 'slack', name: 'Slack', icon: '💬', color: '#4a154b', description: 'Team communication', category: 'communication', url: 'https://slack.com', isBuiltIn: false },
  { id: 'notion', name: 'Notion', icon: '📓', color: '#000000', description: 'Notes and wiki', category: 'productivity', url: 'https://notion.so', isBuiltIn: false },
  { id: 'figma', name: 'Figma', icon: '🎨', color: '#f24e1e', description: 'Design tool', category: 'development', url: 'https://figma.com', isBuiltIn: false },
  { id: 'github', name: 'GitHub', icon: '🐙', color: '#333333', description: 'Code hosting', category: 'development', url: 'https://github.com', isBuiltIn: false },
  { id: 'twitter', name: 'Twitter', icon: '🐦', color: '#1da1f2', description: 'Social media', category: 'communication', url: 'https://twitter.com', isBuiltIn: false },
  { id: 'discord', name: 'Discord', icon: '🎮', color: '#5865f2', description: 'Voice chat', category: 'communication', url: 'https://discord.com', isBuiltIn: false },
];

interface DepthOSStore {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  currentTheme: EnvironmentTheme;
  currentEnvironment: Environment | null;
  settingsOpen: boolean;
  helpOpen: boolean;
  minimapOpen: boolean;
  appDrawerOpen: boolean;
  onboardingComplete: boolean;
  currentOnboardingStep: number;
  settings: AppSettings;
  postProcessing: PostProcessingSettings;
  cameraState: CameraState;
  isFocused: boolean;
  focusedAppId: string | null;
  selectedAppId: string | null;
  keyboard: KeyboardState;
  isPointerLocked: boolean;
  systemInfo: SystemInfo;
  weatherData: WeatherData | null;
  marketplaceApps: MarketplaceApp[];

  // Workspace actions
  setActiveWorkspace: (id: string) => void;
  createWorkspace: (name: string, themeId?: EnvironmentTheme) => Workspace;
  deleteWorkspace: (id: string) => void;
  saveWorkspace: () => void;
  loadWorkspace: (id: string) => void;
  renameWorkspace: (id: string, name: string) => void;
  duplicateWorkspace: (id: string) => Workspace;
  resetWorkspace: () => void;

  // App actions
  addApp: (app: Omit<AppInstance, 'id'>) => void;
  addAppFromMarketplace: (marketplaceApp: MarketplaceApp) => void;
  updateApp: (id: string, updates: Partial<AppInstance>) => void;
  removeApp: (id: string) => void;
  focusApp: (id: string) => void;
  unfocusApp: () => void;
  selectApp: (id: string | null) => void;
  cycleApps: (direction: 'next' | 'prev') => void;
  moveApp: (id: string, position: { x: number; y: number; z: number }) => void;
  resizeApp: (id: string, scale: { x: number; y: number; z: number }) => void;
  toggleAppPin: (id: string) => void;
  toggleAppMinimize: (id: string) => void;

  // Widget actions
  addWidget: (widget: Omit<Widget, 'id'>) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  removeWidget: (id: string) => void;

  // Environment actions
  setTheme: (theme: EnvironmentTheme) => void;

  // UI actions
  toggleSettings: () => void;
  toggleHelp: () => void;
  toggleMinimap: () => void;
  toggleAppDrawer: () => void;
  closeAppDrawer: () => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;

  // Settings actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  updatePostProcessing: (updates: Partial<PostProcessingSettings>) => void;
  setQuality: (quality: QualityLevel) => void;
  resetSettings: () => void;

  // Camera actions
  updateCamera: (state: Partial<CameraState>) => void;

  // Input actions
  updateKeyboard: (state: Partial<KeyboardState>) => void;
  setPointerLocked: (locked: boolean) => void;

  // System actions
  updateSystemInfo: (info: Partial<SystemInfo>) => void;
  updateWeatherData: (data: WeatherData) => void;
  refreshWeather: () => void;
}

export const useDepthOSStore = create<DepthOSStore>()(
  persist(
    (set, get) => ({
      workspaces: [createDefaultWorkspace()],
      activeWorkspaceId: 'default',
      currentTheme: 'cosmic',
      currentEnvironment: environments.cosmic,
      settingsOpen: false,
      helpOpen: false,
      minimapOpen: true,
      appDrawerOpen: false,
      onboardingComplete: false,
      currentOnboardingStep: 0,
      settings: defaultSettings,
      postProcessing: defaultPostProcessing,
      cameraState: defaultCameraState,
      isFocused: false,
      focusedAppId: null,
      selectedAppId: null,
      keyboard: defaultKeyboardState,
      isPointerLocked: false,
      systemInfo: defaultSystemInfo,
      weatherData: null,
      marketplaceApps: defaultMarketplaceApps,

      setActiveWorkspace: (id) => {
        const workspace = get().workspaces.find((w) => w.id === id);
        if (workspace) {
          set({
            activeWorkspaceId: id,
            currentEnvironment: environments[workspace.environmentId as EnvironmentTheme] || environments.cosmic,
            currentTheme: (workspace.environmentId as EnvironmentTheme) || 'cosmic',
            cameraState: workspace.cameraState,
            isFocused: false,
            focusedAppId: null,
          });
        }
      },

      createWorkspace: (name, themeId = 'cosmic') => {
        const newWorkspace: Workspace = {
          id: `workspace-${Date.now()}`,
          name,
          environmentId: themeId,
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          apps: [],
          widgets: [],
          cameraState: defaultCameraState,
        };
        set((state) => ({ workspaces: [...state.workspaces, newWorkspace] }));
        return newWorkspace;
      },

      deleteWorkspace: (id) => {
        if (id === 'default') return;
        set((state) => ({
          workspaces: state.workspaces.filter((w) => w.id !== id),
          activeWorkspaceId: state.activeWorkspaceId === id ? 'default' : state.activeWorkspaceId,
        }));
      },

      saveWorkspace: () => {
        const { activeWorkspaceId, cameraState } = get();
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === activeWorkspaceId ? { ...w, modifiedAt: new Date().toISOString(), cameraState } : w
          ),
        }));
      },

      loadWorkspace: (id) => get().setActiveWorkspace(id),

      renameWorkspace: (id, name) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) => w.id === id ? { ...w, name } : w),
        }));
      },

      duplicateWorkspace: (id) => {
        const workspace = get().workspaces.find((w) => w.id === id);
        if (!workspace) throw new Error('Workspace not found');
        const newWorkspace: Workspace = {
          ...JSON.parse(JSON.stringify(workspace)),
          id: `workspace-${Date.now()}`,
          name: `${workspace.name} (Copy)`,
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
        };
        set((state) => ({ workspaces: [...state.workspaces, newWorkspace] }));
        return newWorkspace;
      },

      resetWorkspace: () => {
        const defaultWorkspace = createDefaultWorkspace();
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === state.activeWorkspaceId ? { 
              ...defaultWorkspace, 
              id: w.id, 
              name: w.name,
              createdAt: w.createdAt,
              modifiedAt: new Date().toISOString()
            } : w
          ),
        }));
      },

      addApp: (app) => {
        const newApp: AppInstance = { ...app, id: `app-${Date.now()}` };
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === state.activeWorkspaceId ? { ...w, apps: [...(w.apps || []), newApp] } : w
          ),
        }));
      },

      addAppFromMarketplace: (marketplaceApp) => {
        const newApp: AppInstance = {
          id: `app-${Date.now()}`,
          name: marketplaceApp.name,
          icon: marketplaceApp.icon,
          color: marketplaceApp.color,
          position: { x: Math.random() * 6 - 3, y: 2 + Math.random() * 2, z: -4 - Math.random() * 2 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          scale: { x: 3, y: 2, z: 0.1 },
          zoneId: null,
          pinned: false,
          opacity: 1,
          isFocused: false,
          isMinimized: false,
          url: marketplaceApp.url,
          contentType: marketplaceApp.url ? 'iframe' : 'mock',
        };
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === state.activeWorkspaceId ? { ...w, apps: [...(w.apps || []), newApp] } : w
          ),
          appDrawerOpen: false,
        }));
      },

      updateApp: (id, updates) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === state.activeWorkspaceId ? { ...w, apps: (w.apps || []).map((a) => (a.id === id ? { ...a, ...updates } : a)) } : w
          ),
        }));
      },

      removeApp: (id) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === state.activeWorkspaceId ? { ...w, apps: (w.apps || []).filter((a) => a.id !== id) } : w
          ),
          focusedAppId: state.focusedAppId === id ? null : state.focusedAppId,
          selectedAppId: state.selectedAppId === id ? null : state.selectedAppId,
        }));
      },

      focusApp: (id) => {
        set({ isFocused: true, focusedAppId: id });
        get().updateApp(id, { isFocused: true });
      },

      unfocusApp: () => {
        const { focusedAppId } = get();
        if (focusedAppId) get().updateApp(focusedAppId, { isFocused: false });
        set({ isFocused: false, focusedAppId: null });
      },

      selectApp: (id) => set({ selectedAppId: id }),

      cycleApps: (direction) => {
        const { workspaces, activeWorkspaceId } = get();
        const workspace = workspaces.find((w) => w.id === activeWorkspaceId);
        const apps = workspace?.apps;
        if (!apps || apps.length === 0) return;
        const currentIndex = apps.findIndex((a) => a.id === get().focusedAppId);
        let nextIndex: number;
        if (currentIndex === -1) nextIndex = 0;
        else if (direction === 'next') nextIndex = (currentIndex + 1) % apps.length;
        else nextIndex = (currentIndex - 1 + apps.length) % apps.length;
        get().selectApp(apps[nextIndex].id);
      },

      moveApp: (id, position) => {
        const { settings, workspaces, activeWorkspaceId } = get();
        let newPos = { ...position };

        // Grid snapping
        if (settings.gridSnapping) {
          const gridSize = 0.5;
          newPos.x = Math.round(newPos.x / gridSize) * gridSize;
          newPos.y = Math.round(newPos.y / gridSize) * gridSize;
          newPos.z = Math.round(newPos.z / gridSize) * gridSize;
        }

        // Basic collision/occlusion prevention
        const workspace = workspaces.find((w) => w.id === activeWorkspaceId);
        const otherApps = (workspace?.apps || []).filter((a) => a.id !== id && !a.isMinimized);
        const thisApp = (workspace?.apps || []).find((a) => a.id === id);

        if (thisApp) {
          for (const other of otherApps) {
            const dx = Math.abs(newPos.x - other.position.x);
            const dy = Math.abs(newPos.y - other.position.y);
            const dz = Math.abs(newPos.z - other.position.z);
            
            // If very close in all axes, nudge slightly
            const minX = (thisApp.scale.x + other.scale.x) / 2;
            const minY = (thisApp.scale.y + other.scale.y) / 2;
            const minZ = 0.2; // Windows are thin

            if (dx < minX * 0.8 && dy < minY * 0.8 && dz < minZ) {
              // Collision detected, keep old depth or nudge
              newPos.z += 0.21; // Push forward slightly
            }
          }
        }

        get().updateApp(id, { position: newPos });
      },

      resizeApp: (id, scale) => get().updateApp(id, { scale }),

      toggleAppPin: (id) => {
        const workspace = get().workspaces.find((w) => w.id === get().activeWorkspaceId);
        const app = (workspace?.apps || []).find((a) => a.id === id);
        if (app) get().updateApp(id, { pinned: !app.pinned });
      },

      toggleAppMinimize: (id) => {
        const workspace = get().workspaces.find((w) => w.id === get().activeWorkspaceId);
        const app = (workspace?.apps || []).find((a) => a.id === id);
        if (app) get().updateApp(id, { isMinimized: !app.isMinimized });
      },

      addWidget: (widget) => {
        const newWidget: Widget = { ...widget, id: `widget-${Date.now()}` };
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === state.activeWorkspaceId ? { ...w, widgets: [...(w.widgets || []), newWidget] } : w
          ),
        }));
      },

      updateWidget: (id, updates) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === state.activeWorkspaceId ? { ...w, widgets: (w.widgets || []).map((wid) => (wid.id === id ? { ...wid, ...updates } : wid)) } : w
          ),
        }));
      },

      removeWidget: (id) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === state.activeWorkspaceId ? { ...w, widgets: (w.widgets || []).filter((wid) => wid.id !== id) } : w
          ),
        }));
      },

      setTheme: (theme) => {
        set({ currentTheme: theme, currentEnvironment: environments[theme] });
        const { workspaces, activeWorkspaceId } = get();
        set({
          workspaces: workspaces.map((w) => (w.id === activeWorkspaceId ? { ...w, environmentId: theme } : w)),
        });
      },

      toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),
      toggleHelp: () => set((state) => ({ helpOpen: !state.helpOpen })),
      toggleMinimap: () => set((state) => ({ minimapOpen: !state.minimapOpen })),
      toggleAppDrawer: () => set((state) => ({ appDrawerOpen: !state.appDrawerOpen })),
      closeAppDrawer: () => set({ appDrawerOpen: false }),
      setOnboardingStep: (step) => set({ currentOnboardingStep: step }),
      completeOnboarding: () => set({ onboardingComplete: true, currentOnboardingStep: 0 }),

      updateSettings: (updates) => set((state) => ({ settings: { ...state.settings, ...updates } })),
      updatePostProcessing: (updates) => set((state) => ({ postProcessing: { ...state.postProcessing, ...updates } })),

      setQuality: (quality) => {
        const qualitySettings: Record<QualityLevel, Partial<AppSettings>> = {
          low: { enablePostProcessing: false, enableShadows: false, enableBloom: false, enableSSAO: false },
          medium: { enablePostProcessing: true, enableShadows: true, enableBloom: false, enableSSAO: false },
          high: { enablePostProcessing: true, enableShadows: true, enableBloom: true, enableSSAO: true },
          ultra: { enablePostProcessing: true, enableShadows: true, enableBloom: true, enableSSAO: true },
        };
        set((state) => ({ settings: { ...state.settings, quality, ...qualitySettings[quality] } }));
      },

      resetSettings: () => set({ settings: defaultSettings, postProcessing: defaultPostProcessing }),

      updateCamera: (state) => set((prev) => ({ cameraState: { ...prev.cameraState, ...state } })),

      updateKeyboard: (state) => set((prev) => ({ keyboard: { ...prev.keyboard, ...state } })),
      setPointerLocked: (locked) => set({ isPointerLocked: locked }),

      updateSystemInfo: (info) => set((state) => ({ systemInfo: { ...state.systemInfo, ...info } })),
      updateWeatherData: (data) => set({ weatherData: data }),

      refreshWeather: () => {
        // Get location from weather widget config, default to 'San Francisco'
        const state = get();
        const weatherWidget = state.workspaces.find(w => w.id === state.activeWorkspaceId)?.widgets?.find(w => w.type === 'weather');
        const location = weatherWidget?.config?.location || 'San Francisco';
        const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy'];
        const data: WeatherData = {
          temperature: Math.floor(Math.random() * 30) + 10,
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          humidity: Math.floor(Math.random() * 60) + 20,
          windSpeed: Math.floor(Math.random() * 30),
          location: location,
        };
        get().updateWeatherData(data);
      },
    }),
    {
      name: 'depth-os-storage',
      partialize: (state) => ({
        workspaces: state.workspaces,
        activeWorkspaceId: state.activeWorkspaceId,
        settings: state.settings,
        postProcessing: state.postProcessing,
        onboardingComplete: state.onboardingComplete,
      }),
      merge: (persistedState: any, currentState: any) => {
        // Deep merge with null safety
        const defaultWorkspace = createDefaultWorkspace();

        // CWE-400: Limit persisted state size to prevent memory exhaustion
        const MAX_STATE_SIZE = 5 * 1024 * 1024; // 5MB limit
        const persistedStr = JSON.stringify(persistedState);
        if (persistedStr && persistedStr.length > MAX_STATE_SIZE) {
          console.warn('Persisted state exceeds size limit, using default state');
          return {
            ...currentState,
            workspaces: [defaultWorkspace],
            activeWorkspaceId: defaultWorkspace.id,
          };
        }

        // CWE-79: Sanitize persisted state to prevent XSS via LocalStorage injection
        const sanitizeString = (str: any): string => {
          if (typeof str !== 'string') return str;
          return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
        };

        const sanitizeWorkspace = (workspace: any) => {
          if (!workspace) return defaultWorkspace;
          return {
            ...workspace,
            id: workspace.id || defaultWorkspace.id,
            name: sanitizeString(workspace.name) || defaultWorkspace.name,
            environmentId: workspace.environmentId || 'cosmic',
            createdAt: workspace.createdAt || defaultWorkspace.createdAt,
            modifiedAt: workspace.modifiedAt || new Date().toISOString(),
            apps: (workspace.apps || []).slice(0, 50).map((app: any) => ({
              ...app,
              name: sanitizeString(app.name) || 'Unnamed App',
              url: app.url || null, // URLs need validation, not sanitization
            })),
            widgets: (workspace.widgets || []).slice(0, 50),
          };
        };

        // Ensure workspaces array exists and each workspace has apps/widgets
        const persistedWorkspaces = persistedState?.workspaces?.map(sanitizeWorkspace) || [defaultWorkspace];

        // Limit total workspaces
        const limitedWorkspaces = persistedWorkspaces.slice(0, 20);

        return {
          ...currentState,
          ...persistedState,
          workspaces: limitedWorkspaces,
        };
      },
    }
  )
);
