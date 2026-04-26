// Core types for Depth OS
// A 3D immersive desktop environment

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Quat {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface CameraState {
  position: Vec3;
  rotation: Quat;
  fov: number;
}

export interface AppInstance {
  id: string;
  name: string;
  icon: string;
  color: string;
  position: Vec3;
  rotation: Quat;
  scale: Vec3;
  zoneId: string | null;
  pinned: boolean;
  opacity: number;
  isFocused: boolean;
  isMinimized: boolean;
  url?: string;
  contentType: 'mock' | 'iframe' | 'widget';
}

export interface Widget {
  id: string;
  type: 'clock' | 'notes' | 'weather' | 'system' | 'calendar';
  position: Vec3;
  scale: Vec3;
  config: Record<string, unknown>;
}

export interface Environment {
  id: string;
  name: string;
  skybox: string;
  groundColor: string;
  ambientColor: string;
  lightColor: string;
  fogColor: string;
  fogDensity: number;
}

export interface Workspace {
  id: string;
  name: string;
  environmentId: string;
  createdAt: string;
  modifiedAt: string;
  apps: AppInstance[];
  widgets: Widget[];
  cameraState: CameraState;
}

export type EnvironmentTheme = 'cosmic' | 'zen' | 'cyberpunk';

export interface ThemeConfig {
  id: EnvironmentTheme;
  name: string;
  description: string;
  environment: Environment;
  uiColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
}

export interface KeyboardState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  sprint: boolean;
}

export type QualityLevel = 'low' | 'medium' | 'high' | 'ultra';

export interface AppSettings {
  theme: EnvironmentTheme;
  uiTheme: 'dark' | 'light';
  quality: QualityLevel;
  fov: number;
  mouseSensitivity: number;
  showMinimap: boolean;
  showWidgets: boolean;
  reducedMotion: boolean;
  enablePostProcessing: boolean;
  enableBloom: boolean;
  enableSSAO: boolean;
  enableDOF: boolean;
  enableShadows: boolean;
  autoSave: boolean;
  showFPS: boolean;
  ambientVolume: number;
}

export interface PostProcessingSettings {
  bloom: { intensity: number; threshold: number; smoothing: number };
  ssao: { radius: number; intensity: number };
  dof: { focusDistance: number; focalLength: number; bokehScale: number };
}

export interface SystemInfo {
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage: number;
  networkSpeed: number;
  batteryLevel: number;
  temperature: number;
}

export interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface MarketplaceApp {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: 'productivity' | 'communication' | 'entertainment' | 'development' | 'utilities';
  url?: string;
  isBuiltIn: boolean;
}

export interface DepthOSState {
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
}
