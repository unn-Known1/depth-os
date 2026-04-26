import { Object3D } from 'three';
import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// Extend Three.js Object3D with JSX
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    color?: string;
    roughness?: number;
    metalness?: number;
    wireframe?: boolean;
    transparent?: boolean;
    opacity?: number;
    size?: number;
    sizeAttenuation?: boolean;
    count?: number;
    itemSize?: number;
    array?: Float32Array;
    attach?: string;
    linewidth?: number;
    side?: number;
    emissive?: string;
    emissiveIntensity?: number;
  }
}
