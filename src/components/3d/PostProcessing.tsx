import { useRef, useEffect } from 'react';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import { useDepthOSStore } from '../../stores/depthOSStore';

export const PostProcessing: React.FC = () => {
  const { settings, postProcessing } = useDepthOSStore();
  const { enableBloom, enablePostProcessing, reducedMotion } = settings;

  if (!enablePostProcessing || reducedMotion) {
    return null;
  }

  return (
    <EffectComposer multisampling={0}>
      {enableBloom && (
        <Bloom
          intensity={postProcessing.bloom.intensity}
          luminanceThreshold={postProcessing.bloom.threshold}
          luminanceSmoothing={postProcessing.bloom.smoothing}
          mipmapBlur
        />
      )}
      <Vignette darkness={0.5} offset={0.3} />
      <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.0005, 0.0005)}
      />
    </EffectComposer>
  );
};

// FPS counter component - outside Canvas, uses ref-based approach
export const FPSCounter: React.FC = () => {
  const fpsRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef<number>();

  // Use requestAnimationFrame instead of useFrame
  const updateFPS = () => {
    frameRef.current++;
    const now = performance.now();
    const delta = now - lastTimeRef.current;

    if (delta >= 1000 && fpsRef.current) {
      const fps = Math.round((frameRef.current * 1000) / delta);
      fpsRef.current.textContent = fps.toString();
      frameRef.current = 0;
      lastTimeRef.current = now;
    }
    rafRef.current = requestAnimationFrame(updateFPS);
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updateFPS);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 rounded-lg border border-white/20 font-mono text-sm z-50">
      <span ref={fpsRef} className="text-green-400">0</span>
      <span className="text-gray-400 ml-1">FPS</span>
    </div>
  );
};
