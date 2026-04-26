import { useState } from 'react';
import { ArrowRight, ArrowLeft, X, Mouse, Keyboard, Eye, Layers, Sparkles } from 'lucide-react';
import { useDepthOSStore } from '../../stores/depthOSStore';

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Depth OS',
    description: 'A revolutionary 3D immersive desktop environment that transforms your workflow.',
    icon: <Sparkles size={48} className="text-indigo-400" />,
    highlight: null,
  },
  {
    id: 'navigation',
    title: 'Navigate in 3D Space',
    description: 'Use WASD keys to move around, Space to go up, Shift to go down. Use mouse to look around.',
    icon: <Mouse size={48} className="text-blue-400" />,
    highlight: 'keyboard',
  },
  {
    id: 'apps',
    title: 'Interact with Apps',
    description: 'Click on any app window to select it. Double-click to focus and interact with it directly.',
    icon: <Eye size={48} className="text-green-400" />,
    highlight: 'apps',
  },
  {
    id: 'workspaces',
    title: 'Multiple Workspaces',
    description: 'Create and manage multiple workspaces with different themes for different projects.',
    icon: <Layers size={48} className="text-purple-400" />,
    highlight: 'workspace',
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    description: 'Tab to cycle apps, M to toggle minimap, ESC to exit focus mode. Press Ctrl+S to save.',
    icon: <Keyboard size={48} className="text-orange-400" />,
    highlight: 'shortcuts',
  },
];

export const Onboarding: React.FC = () => {
  const { onboardingComplete, currentOnboardingStep, setOnboardingStep, completeOnboarding } = useDepthOSStore();
  const [isSkipped, setIsSkipped] = useState(false);

  if (onboardingComplete || isSkipped) return null;

  const currentStep = steps[currentOnboardingStep];
  const progress = ((currentOnboardingStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentOnboardingStep < steps.length - 1) {
      setOnboardingStep(currentOnboardingStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentOnboardingStep > 0) {
      setOnboardingStep(currentOnboardingStep - 1);
    }
  };

  const handleSkip = () => {
    setIsSkipped(true);
    completeOnboarding();
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-gray-900/95 rounded-2xl border border-white/10 w-[550px] overflow-hidden shadow-2xl">
        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">{currentStep.icon}</div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-3">{currentStep.title}</h2>

          {/* Description */}
          <p className="text-gray-400 mb-8 leading-relaxed">{currentStep.description}</p>

          {/* Keyboard hints for navigation step */}
          {currentStep.highlight === 'keyboard' && (
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="flex justify-center gap-4 mb-3">
                <kbd className="px-3 py-2 bg-gray-800 rounded text-white font-mono">W</kbd>
                <kbd className="px-3 py-2 bg-gray-800 rounded text-white font-mono">A</kbd>
                <kbd className="px-3 py-2 bg-gray-800 rounded text-white font-mono">S</kbd>
                <kbd className="px-3 py-2 bg-gray-800 rounded text-white font-mono">D</kbd>
              </div>
              <div className="flex justify-center gap-4">
                <kbd className="px-3 py-2 bg-gray-800 rounded text-white font-mono">Space</kbd>
                <kbd className="px-3 py-2 bg-gray-800 rounded text-white font-mono">Shift</kbd>
              </div>
            </div>
          )}

          {/* Keyboard shortcuts for shortcuts step */}
          {currentStep.highlight === 'shortcuts' && (
            <div className="bg-white/5 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Cycle apps</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-gray-800 rounded text-white text-sm">Tab</kbd>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Toggle minimap</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-white text-sm">M</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Exit focus</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-white text-sm">ESC</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Save workspace</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-gray-800 rounded text-white text-sm">Ctrl</kbd>
                  <kbd className="px-2 py-1 bg-gray-800 rounded text-white text-sm">S</kbd>
                </div>
              </div>
            </div>
          )}

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentOnboardingStep ? 'bg-indigo-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              Skip tutorial
            </button>

            <div className="flex gap-3">
              {currentOnboardingStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {currentOnboardingStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
