import React from 'react';
import { Composition, continueRender, delayRender } from 'remotion';
import { SilentPeriod } from './SilentPeriod';
import { FPS, WIDTH, HEIGHT, TOTAL_FRAMES } from './shared/constants';

// ────────────────────────────────────────────────────────────
// FONT LOADING GUARD
// Preloads Finger Paint before first frame renders
// ────────────────────────────────────────────────────────────
const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = React.useState(() => delayRender('Loading Finger Paint font'));

  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Finger+Paint&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Also inject a preconnect for faster loading
    const preconnect = document.createElement('link');
    preconnect.href = 'https://fonts.googleapis.com';
    preconnect.rel = 'preconnect';
    document.head.appendChild(preconnect);

    const preconnect2 = document.createElement('link');
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.rel = 'preconnect';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    // Wait for fonts to load
    document.fonts.ready.then(() => {
      continueRender(handle);
    });

    // Fallback: continue after 3s regardless
    const timeout = setTimeout(() => {
      continueRender(handle);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [handle]);

  return <>{children}</>;
};

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="SilentPeriod"
        component={() => (
          <FontLoader>
            <SilentPeriod />
          </FontLoader>
        )}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
