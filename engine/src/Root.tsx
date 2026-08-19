import React from 'react';
import { Composition, continueRender, delayRender, getInputProps, staticFile } from 'remotion';
import { ToneVideo } from './ToneVideo';
import { KanshuAppOutro } from './components/AppOutro';
import { EtymologyTemplate, EtymologyConfig } from './templates/EtymologyTemplate';
import { FPS, WIDTH, HEIGHT, TOTAL_FRAMES } from './shared/constants';

// Load default Video #3 config for fallback rendering
import defaultXiuConfig from '../../content/03_etymology_xiu/config.json';
import bangzhuConfig from '../../content/04_etymology_bangzhu/config.json';
import pengyouConfig from '../../content/05_etymology_pengyou/config.json';
import aiqingConfig from '../../content/06_etymology_aiqing/config.json';
import wangjiConfig from '../../content/07_etymology_wangji/config.json';
import jieshaoConfig from '../../content/08_etymology_jieshao/config.json';
import kaishiConfig from '../../content/09_etymology_kaishi/config.json';
import xihuanConfig from '../../content/10_etymology_xihuan/config.json';
import dongxiConfig from '../../content/11_etymology_dongxi/config.json';
import chicuConfig from '../../content/11_etymology_chicu/config.json';
import daraoConfig from '../../content/12_etymology_darao/config.json';

// ────────────────────────────────────────────────────────────
// FONT LOADER GUARD
// ────────────────────────────────────────────────────────────

const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = React.useState(() => delayRender('Loading Fonts'));

  React.useEffect(() => {
    const preconnect = document.createElement('link');
    preconnect.href = 'https://fonts.googleapis.com';
    preconnect.rel = 'preconnect';
    document.head.appendChild(preconnect);

    const preconnect2 = document.createElement('link');
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.rel = 'preconnect';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Finger+Paint&family=Inter:wght@400;600;700;800;900&family=Noto+Sans+SC:wght@400;700;900&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Add local @font-face style rule that maps all font-weight variants (400 to 900) to Finger Paint
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'Finger Paint';
        src: url('${staticFile('fonts/FingerPaint-Regular.woff2')}') format('woff2');
        font-weight: 100 900;
        font-style: normal;
        font-display: block;
      }
    `;
    document.head.appendChild(style);

    const checkAndPreload = async () => {
      try {
        const localFingerPaint = new FontFace('Finger Paint', `url('${staticFile('fonts/FingerPaint-Regular.woff2')}')`, {
          weight: '100 900',
          style: 'normal',
        });
        const loaded = await localFingerPaint.load();
        document.fonts.add(loaded);

        await document.fonts.ready;
        await Promise.all([
          document.fonts.load('140px "Finger Paint"', 'CHINESE IS WILD 🔥 JEALOUS EATING VINEGAR BUT WHY EXCUSE ME HITTING MONKEYS'),
          document.fonts.load('900 140px "Finger Paint"', 'CHINESE IS WILD 🔥 JEALOUS EATING VINEGAR BUT WHY EXCUSE ME HITTING MONKEYS'),
          document.fonts.load('900 250px "Noto Sans SC"', '打扰吃醋东西喜欢开始介绍忘记爱情朋友'),
          document.fonts.load('800 42px "Inter"', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'),
          document.fonts.load('700 28px "Roboto"', 'abcdefghijklmnopqrstuvwxyz0123456789'),
        ]);
        await document.fonts.ready;
      } catch (err) {
        console.warn('Font preload warning:', err);
      } finally {
        continueRender(handle);
      }
    };

    checkAndPreload();

    const timeout = setTimeout(() => {
      continueRender(handle);
    }, 4000);

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
      const aiqingTotalFrames = aiqingConfig.lessonDurationInFrames + aiqingConfig.outroDurationInFrames;
      const wangjiTotalFrames = wangjiConfig.lessonDurationInFrames + wangjiConfig.outroDurationInFrames;
      const jieshaoTotalFrames = jieshaoConfig.lessonDurationInFrames + (jieshaoConfig.outroDurationInFrames || 0);
      const kaishiTotalFrames = kaishiConfig.lessonDurationInFrames + (kaishiConfig.outroDurationInFrames || 0);
      const xihuanTotalFrames = xihuanConfig.lessonDurationInFrames + (xihuanConfig.outroDurationInFrames || 0);
      const dongxiTotalFrames = dongxiConfig.lessonDurationInFrames + (dongxiConfig.outroDurationInFrames || 0);
      const chicuTotalFrames = chicuConfig.lessonDurationInFrames + (chicuConfig.outroDurationInFrames || 0);
      const daraoTotalFrames = daraoConfig.lessonDurationInFrames + (daraoConfig.outroDurationInFrames || 0);

  return (
    <>
      {/* Etymology Video Template Composition (Video #12: 打扰) */}
      <Composition
        id="EtymologyDarao"
        component={() => (
          <FontLoader>
            <EtymologyTemplate {...(daraoConfig as EtymologyConfig)} />
          </FontLoader>
        )}
        durationInFrames={daraoTotalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Etymology Video Template Composition (Video #11: 吃醋) */}
      <Composition
        id="EtymologyChicu"
        component={() => (
          <FontLoader>
            <EtymologyTemplate {...(chicuConfig as EtymologyConfig)} />
          </FontLoader>
        )}
        durationInFrames={chicuTotalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Etymology Video Template Composition (Video #11: 东西) */}
      <Composition
        id="EtymologyDongxi"
        component={() => (
          <FontLoader>
            <EtymologyTemplate {...(dongxiConfig as EtymologyConfig)} />
          </FontLoader>
        )}
        durationInFrames={dongxiTotalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Etymology Video Template Composition (Video #10: 喜欢) */}
      <Composition
        id="EtymologyXihuan"
        component={() => (
          <FontLoader>
            <EtymologyTemplate {...(xihuanConfig as EtymologyConfig)} />
          </FontLoader>
        )}
        durationInFrames={xihuanTotalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Etymology Video Template Composition (Video #9: 开始) */}
      <Composition
        id="EtymologyKaishi"
        component={() => (
          <FontLoader>
            <EtymologyTemplate {...(kaishiConfig as EtymologyConfig)} />
          </FontLoader>
        )}
        durationInFrames={kaishiTotalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Etymology Video Template Composition (Video #8: 介绍) */}
      <Composition
        id="EtymologyJieshao"
        component={() => (
          <FontLoader>
            <EtymologyTemplate {...(jieshaoConfig as EtymologyConfig)} />
          </FontLoader>
        )}
        durationInFrames={jieshaoTotalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Etymology Video Template Composition (Video #7: 忘记) */}
      <Composition
        id="EtymologyWangji"
        component={() => (
          <FontLoader>
            <EtymologyTemplate {...(wangjiConfig as EtymologyConfig)} />
          </FontLoader>
        )}
        durationInFrames={wangjiTotalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Etymology Video Template Composition (Video #6: 爱情) */}
      <Composition
        id="EtymologyAiqing"
        component={() => (
          <FontLoader>
            <EtymologyTemplate {...(aiqingConfig as EtymologyConfig)} />
          </FontLoader>
        )}
        durationInFrames={aiqingTotalFrames} // ~43s @ 60fps
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

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
