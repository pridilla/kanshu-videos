import React from 'react';
import { Composition, continueRender, delayRender, getInputProps } from 'remotion';
import { ToneVideo } from './ToneVideo';
import { KanshuAppOutro } from './components/AppOutro';
import { EtymologyTemplate, EtymologyConfig } from './templates/EtymologyTemplate';
import { FPS, WIDTH, HEIGHT, TOTAL_FRAMES } from './shared/constants';

// Load default Video #3 config for fallback rendering
import defaultXiuConfig from '../../content/03_etymology_xiu/config.json';
import bangzhuConfig from '../../content/04_etymology_bangzhu/config.json';
import pengyouConfig from '../../content/05_etymology_pengyou/config.json';

// ────────────────────────────────────────────────────────────
// FONT LOADER GUARD
// ────────────────────────────────────────────────────────────

const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = React.useState(() => delayRender('Loading Fonts'));

  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Finger+Paint&family=Inter:wght@400;600;700;800;900&family=Noto+Sans+SC:wght@400;700;900&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap';
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
  const inputProps = getInputProps() as Partial<EtymologyConfig>;
  const activeEtymologyConfig: EtymologyConfig = {
    ...defaultXiuConfig,
    ...inputProps,
  } as EtymologyConfig;

  const totalEtymologyFrames =
    (activeEtymologyConfig.lessonDurationInFrames || 900) +
    (activeEtymologyConfig.outroDurationInFrames || 400);

      const pengyouTotalFrames = pengyouConfig.lessonDurationInFrames + pengyouConfig.outroDurationInFrames;
      const bangzhuTotalFrames = bangzhuConfig.lessonDurationInFrames + bangzhuConfig.outroDurationInFrames;

  return (
    <>
      {/* Etymology Video Template Composition (Video #5: 朋友) */}
      <Composition
        id="EtymologyPengyou"
        component={() => (
          <FontLoader>
            <EtymologyTemplate {...(pengyouConfig as EtymologyConfig)} />
          </FontLoader>
        )}
        durationInFrames={pengyouTotalFrames} // ~54s @ 60fps
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Standalone Reusable Kanshu Outro Preview */}
      <Composition
        id="KanshuAppOutroPreview"
        component={() => (
          <FontLoader>
            <KanshuAppOutro showAudio={true} audioSrc="kanshu_outro_elevenlabs.mp3" />
          </FontLoader>
        )}
        durationInFrames={425} // ~7.08 seconds @ 60fps (matches ElevenLabs voice tnSpp4vdxKPjI9w0GnoV)
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Etymology Video Template Composition (Video #4: 帮助) */}
      <Composition
        id="EtymologyBangzhu"
        component={() => (
          <FontLoader>
            <EtymologyTemplate {...(bangzhuConfig as EtymologyConfig)} />
          </FontLoader>
        )}
        durationInFrames={bangzhuTotalFrames} // 1325 frames (~22s @ 60fps)
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Etymology Video Template Composition (Video #3: 休) */}
      <Composition
        id="EtymologyVideo"
        component={() => (
          <FontLoader>
            <EtymologyTemplate {...activeEtymologyConfig} />
          </FontLoader>
        )}
        durationInFrames={totalEtymologyFrames} // ~21.6s @ 60fps
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Tone Video Composition (Video #2) */}
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
    </>
  );
};
