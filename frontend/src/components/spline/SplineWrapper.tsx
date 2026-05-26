import React, { useState, useEffect, useRef, Suspense } from 'react';
import { SceneFallback, SceneFallbackProps } from './SceneFallback';

export interface SplineWrapperProps {
  sceneUrl: string;
  height?: string | number;
  width?: string | number;
  title?: string;
  subtitle?: string;
  fallbackType?: SceneFallbackProps['type'];
  interactionMode?: 'pan-zoom' | 'hover' | 'scroll' | 'none';
  loadingStrategy?: 'lazy' | 'eager';
  className?: string;
  overlayContent?: React.ReactNode;
}

// Global detection helper for WebGL 2.0
const isWebGLSupported = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch (e) {
    return false;
  }
};

export const SplineWrapper: React.FC<SplineWrapperProps> = ({
  sceneUrl,
  height = '350px',
  width = '100%',
  title,
  subtitle,
  fallbackType = 'academic',
  interactionMode = 'none',
  loadingStrategy = 'lazy',
  className = '',
  overlayContent,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(loadingStrategy === 'eager');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const loadTimeoutRef = useRef<any>(null);

  // 1. Detect viewport visibility for lazy rendering
  useEffect(() => {
    if (loadingStrategy === 'eager') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only load once when it enters viewport
        }
      },
      { threshold: 0.1, rootMargin: '100px' } // Pre-load slightly before coming in
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loadingStrategy]);

  // 2. Load Spline script dynamically once visible
  useEffect(() => {
    if (!isVisible) return;

    // Check if WebGL is supported
    if (!isWebGLSupported()) {
      setHasError(true);
      return;
    }

    // Check if script is already present on the page
    const existingScript = document.querySelector('script[src*="spline-viewer"]');
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.0.28/build/spline-viewer.js';
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setHasError(true);

    document.head.appendChild(script);

    // Safeguard: If the scene doesn't fire load event within 5s, fallback
    loadTimeoutRef.current = setTimeout(() => {
      if (!isLoaded) {
        console.warn('Spline load timed out. Reverting to static fallback.');
        setIsLoaded(true); // Stop spinner, overlay fallback logic handles the rest
      }
    }, 6000);

    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [isVisible]);

  const handleViewerLoad = () => {
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    setIsLoaded(true);
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    height: typeof height === 'number' ? `${height}px` : height,
    width: typeof width === 'number' ? `${width}px` : width,
    overflow: 'hidden',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // If WebGL is not supported, or script fails, show fallback directly
  if (hasError) {
    return <SceneFallback title={title} subtitle={subtitle} height={height} type={fallbackType} />;
  }

  return (
    <div ref={containerRef} className={`spline-scene-container ${className}`} style={containerStyle}>
      {/* 1. Loading State */}
      {(!scriptLoaded || !isLoaded) && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3 }}>
          <SceneFallback title={title} subtitle="Loading interactive 3D model..." height={height} type={fallbackType} />
        </div>
      )}

      {/* 2. Actual 3D WebGL Canvas (only if visible and WebGL works) */}
      {isVisible && scriptLoaded && (
        <div style={{ width: '100%', height: '100%', zIndex: 1 }}>
          {/* We are utilizing the native web component <spline-viewer> 
              which isolates memory and provides robust touch/mouse controls */}
          {React.createElement('spline-viewer', {
            url: sceneUrl,
            loading: 'eager',
            events: interactionMode === 'none' ? 'none' : 'auto',
            style: { width: '100%', height: '100%', display: 'block', background: 'transparent' },
            ref: (el: any) => {
              if (el) {
                el.addEventListener('load', handleViewerLoad);
              }
            }
          })}
        </div>
      )}

      {/* 3. HTML HUD Overlay */}
      {overlayContent && (
        <div 
          className="spline-overlay flex-row-center" 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <div style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}>
            {overlayContent}
          </div>
        </div>
      )}
    </div>
  );
};
