import type { Environment, EnvironmentTheme, ThemeConfig } from '../types';

// Environment configurations for different themes
export const environments: Record<EnvironmentTheme, Environment> = {
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Space',
    skybox: 'deep-space',
    groundColor: '#1a1a2e',
    ambientColor: '#0f0f23',
    lightColor: '#ffffff',
    fogColor: '#0a0a1a',
    fogDensity: 0.02,
  },
  zen: {
    id: 'zen',
    name: 'Zen Garden',
    skybox: 'zen',
    groundColor: '#e8e4d9',
    ambientColor: '#f5f5dc',
    lightColor: '#fff8e7',
    fogColor: '#f5f5dc',
    fogDensity: 0.01,
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk City',
    skybox: 'cyberpunk',
    groundColor: '#0d0d0d',
    ambientColor: '#1a0a2e',
    lightColor: '#ff00ff',
    fogColor: '#0a0a1a',
    fogDensity: 0.03,
  },
};

// Theme configurations with UI colors
export const themeConfigs: Record<EnvironmentTheme, ThemeConfig> = {
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Space',
    description: 'A serene space environment with stars and nebulas',
    environment: environments.cosmic,
    uiColors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#a78bfa',
      background: '#0f0f23',
      surface: '#1e1e3f',
    },
  },
  zen: {
    id: 'zen',
    name: 'Zen Garden',
    description: 'A peaceful Japanese-inspired garden with soft lighting',
    environment: environments.zen,
    uiColors: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#34d399',
      background: '#f5f5dc',
      surface: '#e8e4d9',
    },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk City',
    description: 'A neon-lit futuristic cityscape',
    environment: environments.cyberpunk,
    uiColors: {
      primary: '#f43f5e',
      secondary: '#ec4899',
      accent: '#f472b6',
      background: '#0d0d0d',
      surface: '#1f1f1f',
    },
  },
};

// Get theme by ID
export const getThemeConfig = (themeId: EnvironmentTheme): ThemeConfig => {
  return themeConfigs[themeId] || themeConfigs.cosmic;
};

// Get all themes as array
export const getAllThemes = (): ThemeConfig[] => {
  return Object.values(themeConfigs);
};
