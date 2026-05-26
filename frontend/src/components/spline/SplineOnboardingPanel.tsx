import React, { useState } from 'react';
import { SplineWrapper } from './SplineWrapper';

interface OnboardingStep {
  title: string;
  description: string;
}

interface SplineOnboardingPanelProps {
  sceneUrl: string;
  steps: OnboardingStep[];
  onFinish?: () => void;
  height?: string | number;
}

export const SplineOnboardingPanel: React.FC<SplineOnboardingPanelProps> = ({
  sceneUrl,
  steps,
  onFinish,
  height = '400px',
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (onFinish) {
      onFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div 
      className="glass-panel animate-fade-in"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        minHeight: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      {/* Visual Canvas Side */}
      <div style={{ position: 'relative', background: 'rgba(99, 102, 241, 0.02)', borderRight: '1px solid var(--border-color)' }}>
        <SplineWrapper 
          sceneUrl={sceneUrl} 
          height="100%" 
          fallbackType="onboarding" 
          interactionMode="pan-zoom"
          loadingStrategy="eager"
        />
      </div>

      {/* Narrative Interactive Step Side */}
      <div style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Progress Indicator */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: 'var(--space-lg)' }}>
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                style={{ 
                  flex: 1, 
                  height: '4px', 
                  borderRadius: '2px', 
                  backgroundColor: idx <= currentStep ? 'var(--accent-primary)' : 'var(--border-color)',
                  transition: 'background-color var(--transition-normal)'
                }}
              />
            ))}
          </div>

          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Step {currentStep + 1} of {steps.length}
          </span>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 'var(--space-xs)', marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>
            {steps[currentStep].title}
          </h2>
          
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {steps[currentStep].description}
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-xl)' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleBack} 
            disabled={currentStep === 0}
          >
            Back
          </button>
          
          <button className="btn btn-primary" onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Next Step'}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .glass-panel {
            grid-template-columns: 1fr !important;
          }
          .glass-panel > div:first-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
