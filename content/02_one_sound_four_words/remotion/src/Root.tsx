import React from 'react';
import { Composition, continueRender, delayRender } from 'remotion';
import { ToneVideo } from './ToneVideo';
import { KanshuAppOutro } from './scenes/Scene_AppOutro';
import { FPS, WIDTH, HEIGHT, TOTAL_FRAMES } from './shared/constants';

// ────────────────────────────────────────────────────────────
// FONT LOADING GUARD
// Preloads Google Fonts before first frame renders
// ────────────────────────────────────────────────────────────

const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = React.useState(() => delayRender('Loading Fonts'));

  React.useEffect(() => {
    // Load Finger Paint, Inter, ZCOOL KuaiLe, Noto Serif SC
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Finger+Paint&family=Inter:wght@400;600;700;800;900&family=ZCOOL+KuaiLe&family=Noto+Serif+SC:wght@600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const preconnect = document.createElement('link');
    preconnect.href = 'https://fonts.googleapis.com';
    preconnect.rel = 'preconnect';
    document.head.appendChild(preconnect);

    const preconnect2 = document.createElement('link');
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.rel = 'preconnect';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    document.fonts.ready.then(() => {
      continueRender(handle);
    });

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
        id="OneSoundFourWords"
        component={() => (
          <FontLoader>
            <ToneVideo />
          </FontLoader>
        )}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Standalone Reusable Kanshu Outro Preview */}
      <Composition
        id="KanshuAppOutroPreview"
        component={() => (
          <FontLoader>
            <KanshuAppOutro showAudio={true} audioSrc="kanshu_outro_voice.mp3" />
          </FontLoader>
        )}
        durationInFrames={400} // ~6.6 seconds @ 60fps
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};

