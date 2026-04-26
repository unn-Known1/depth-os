# Depth OS - 3D Immersive Desktop Environment

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-black.svg)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)

Depth OS is a revolutionary, open-source 3D immersive desktop environment built for the modern web. It transforms your flat screen into a spatial workspace where you can interact with applications in a 3D environment.

## 🚀 Key Features

- **Spatial Multitasking**: Arrange your workspace in 3D space. Drag, resize, and position windows anywhere in the environment.
- **Real App Integration**: Load actual websites and web applications via 3D iframes.
- **Dynamic Themes**: Switch between multiple immersive environments (Cosmic Space, Zen Garden, Cyberpunk City).
- **Interactive HUD**: A futuristic Head-Up Display for system monitoring, app launching, and workspace management.
- **Performance Optimized**: Built with React, Three.js (R3F), and Vite for a smooth, high-FPS experience.
- **Persistent Workspaces**: Your layouts are automatically saved to local storage.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **3D Engine**: Three.js, @react-three/fiber, @react-three/drei
- **State Management**: Zustand
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/depth-os.git
   cd depth-os
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## 🎮 Controls

- **W, A, S, D**: Move camera
- **Space / Shift**: Move Up / Down
- **Mouse Drag**: Look around
- **Left Click**: Select / Focus window
- **Window Title Bar**: Drag to move window
- **Bottom Right Handle**: Resize window
- **ESC**: Exit focus mode
- **M**: Toggle Minimap
- **Ctrl + S**: Save Workspace

## 🏗️ Building for Production

### Linux
```bash
pnpm run build:linux
```

### Windows
```bash
pnpm run build:windows
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

If you like this project, please give it a star on GitHub! 🌟
