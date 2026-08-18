import React from 'react';
import { AbsoluteFill, Sequence, spring, interpolate, useCurrentFrame, useVideoConfig, Audio, staticFile, Easing } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_GENTLE, SPRING_BOUNCE, SPRING_SMOOTH, FPS } from '../shared/constants';
import { FloatingParticles } from '../components/Icons';
import { KanshuAppOutro } from '../components/AppOutro';
import { RealtimeCaptions, AlignedWord } from '../components/RealtimeCaptions';
import { ChineseBackground } from '../components/ChineseBackground';

export interface RadicalInfo {
  radical: string;
  pinyin: string;
  meaning: string;
  role: 'semantic' | 'phonetic' | 'pictograph';
}

export interface AnimationPhase {
  startFrame: number;
  endFrame: number;
}

export interface AnimationTimestamps {
  screen1: {
    startFrame: number;
    endFrame: number;
    clothMention?: AnimationPhase;
    wallMention?: AnimationPhase;
    altarMention?: AnimationPhase;
    muscleMention?: AnimationPhase;
    personMention?: AnimationPhase;
    boundariesMention?: AnimationPhase;
    silkMention?: AnimationPhase;
  };
  screen2: {
    startFrame: number;
    endFrame: number;
    topBang: AnimationPhase;
    bottomJin: AnimationPhase;
    wholeBang: AnimationPhase;
  };
  screen3: {
    startFrame: number;
    endFrame: number;
    wholeZhuIntro: AnimationPhase;
    leftQie: AnimationPhase;
    rightLi: AnimationPhase;
    wholeZhuOutro: AnimationPhase;
  };
  screen4: {
    startFrame: number;
    endFrame: number;
    bangHighlightEndFrame: number;
  };
}

export interface ScreenTimestamps {
  screen1EndSec?: number;
  screen1EndFrame: number;
  screen2EndSec?: number;
  screen2EndFrame: number;
  screen3EndSec?: number;
  screen3EndFrame: number;
  lessonTotalSec?: number;
  lessonTotalFrames: number;
}

export interface EtymologyConfig {
  character: string;
  pinyin: string;
  tone: number;
  meaning: string;
  oracleBoneSymbol?: string;
  radicals: RadicalInfo[];
  story: string;
  exampleSentence: {
    cn: string;
    pinyin: string;
    en: string;
    highlightWord: string;
  };
  audioSrc?: string;
  bgmAudioSrc?: string;
  outroAudioSrc?: string;
  wordsAlignment?: AlignedWord[];
  screenTimestamps?: ScreenTimestamps;
  animationTimestamps?: AnimationTimestamps;
  lessonDurationInFrames?: number;
  outroDurationInFrames?: number;
}

const DynamicSmoothSpotlight: React.FC<{
  x: number;
  y: number;
  radius?: number;
  frame: number;
}> = ({ x, y, radius = 120, frame }) => {
  const rotation = (frame * 0.8) % 360;

  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 60,
        transition: 'top 0.45s cubic-bezier(0.16, 1, 0.3, 1), left 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <svg
        width={radius * 2 + 40}
        height={radius * 2 + 40}
        viewBox={`0 0 ${radius * 2 + 40} ${radius * 2 + 40}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: 'width 0.45s cubic-bezier(0.16, 1, 0.3, 1), height 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <circle
          cx={radius + 20}
          cy={radius + 20}
          r={radius}
          fill="none"
          stroke="#0F172A"
          strokeWidth="7"
          strokeDasharray="22 14"
          filter="drop-shadow(0 0 12px rgba(255, 255, 255, 0.95)) drop-shadow(0 6px 20px rgba(15, 23, 42, 0.5))"
          style={{
            transition: 'r 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          top: -(radius - 15),
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#FF6F59',
          fontSize: 68,
          fontWeight: 900,
          filter: 'drop-shadow(0 6px 16px rgba(255, 111, 89, 0.85))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'top 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <span>👇</span>
      </div>
    </div>
  );
};

const ShockwaveRing: React.FC<{
  triggerFrame: number;
  frame: number;
  x?: number;
  y?: number;
  color?: string;
}> = ({ triggerFrame, frame, x = 540, y = 460, color = '#FF6F59' }) => {
  const { fps } = useVideoConfig();
  const relFrame = frame - triggerFrame;
  if (relFrame < 0 || relFrame > 35) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const radius = interpolate(progress, [0, 1], [40, 500]);
  const opacity = interpolate(progress, [0, 0.3, 1], [0.8, 0.6, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        width: radius * 2,
        height: radius * 2,
        borderRadius: '50%',
        border: `4px solid ${color}`,
        transform: 'translate(-50%, -50%)',
        opacity,
        pointerEvents: 'none',
        zIndex: 55,
        boxShadow: `0 0 30px ${color}`,
      }}
    />
  );
};

const OrganicCenterTag: React.FC<{
  emoji: string;
  radical: string;
  pinyin: string;
  translation: string;
  catImages: string[];
  frame: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ emoji, radical, pinyin, translation, catImages, frame, enterFrame, exitFrame }) => {
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 16, mass: 0.7, stiffness: 160 },
  });

  const exitSpring = spring({
    frame: Math.max(0, frame - exitFrame),
    fps,
    config: { damping: 16, mass: 0.7, stiffness: 160 },
  });

  const enterX = enterFrame === 0 
    ? 0 
    : interpolate(enterSpring, [0, 1], [-1400, 0], { easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
  const exitX = frame >= exitFrame ? interpolate(exitSpring, [0, 1], [0, 1400], { easing: Easing.bezier(0.25, 0.1, 0.25, 1) }) : 0;

  const currentX = enterX + exitX;
  const driftY = Math.sin((frame - enterFrame) * 0.08) * 1.5;
  const tiltAngle = (currentX / 1400) * 8; // Dynamic tilt during fly-in/fly-out

  const flipSpeed = 22; // ~2.7 fps calm hand-drawn doodle cadence (0.36s per pose)
  const relativeFrame = Math.max(0, frame - enterFrame);
  const cycleIndex = Math.floor(relativeFrame / flipSpeed) % (catImages.length === 2 ? 2 : 4);
  const currentCatSrc = catImages.length === 2 
    ? catImages[cycleIndex] 
    : catImages[([0, 1, 2, 1][Math.floor(relativeFrame / flipSpeed) % 4]) % catImages.length];

  if (frame < enterFrame || (frame >= exitFrame && exitSpring >= 0.99)) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 730,
        left: '50%',
        transform: `translateX(calc(-50% + ${currentX}px)) translateY(${driftY}px) rotate(${tiltAngle}deg)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        zIndex: 90,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '10px 32px',
          borderRadius: 26,
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.45)',
          border: '2px solid rgba(255, 111, 89, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 38 }}>{emoji}</span>
          <span style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 36, fontWeight: 900, color: '#FFFFFF' }}>
            {radical}
          </span>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 24, fontWeight: 700, color: '#94A3B8', fontStyle: 'italic' }}>
            ({pinyin})
          </span>
        </div>

        <div style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: '#FF6F59', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {translation}
        </div>
      </div>

      {currentCatSrc && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
          }}
        >
          <img
            src={staticFile(currentCatSrc)}
            alt="Borderless Transparent Cat Sketch"
            style={{
              height: 500,
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 14px 28px rgba(15, 23, 42, 0.18))',
            }}
          />
        </div>
      )}
    </div>
  );
};

export const EtymologyTemplate: React.FC<EtymologyConfig> = ({
  character = '喜欢',
  pinyin = 'xǐ huan',
  meaning = 'To Like / Love',
  audioSrc = 'xihuan_voice_single_pass_fast.mp3',
  bgmAudioSrc = 'chinese_lofi_bgm.mp3',
  outroAudioSrc = 'kanshu_outro_elevenlabs.mp3',
  wordsAlignment = [],
  screenTimestamps = {
    screen1EndFrame: 364,
    screen2EndFrame: 950,
    screen3EndFrame: 1401,
    lessonTotalFrames: 1834,
  },
  animationTimestamps,
  lessonDurationInFrames = 1834,
  outroDurationInFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isChicu = character === '吃醋';
  const isDongxi = character === '东西';
  const isXihuan = character === '喜欢';
  const isKaishi = character === '开始';
  const isJieshao = character === '介绍';
  const isWangji = character === '忘记';
  const isAiqing = character === '爱情';
  const isPengyou = character === '朋友';

  const char1 = character.charAt(0) || '喜';
  const char2 = character.charAt(1) || '欢';

  const { screen1EndFrame, screen2EndFrame, screen3EndFrame, lessonTotalFrames } = screenTimestamps;

  const isScreen1 = frame < screen1EndFrame;
  const isScreen2 = frame >= screen1EndFrame && frame < screen2EndFrame;
  const isScreen3 = frame >= screen2EndFrame && frame < screen3EndFrame;
  const isScreen4 = frame >= screen3EndFrame;

  // --- KINETIC HERO HOOK PHASES (0 to 75 frames: ~1.25s) ---
  const isHeroWordPhase = (isXihuan || isDongxi || isChicu) && frame < 75;
  const isWordChinese = isHeroWordPhase && frame < 28;
  const isWordIs = isHeroWordPhase && frame >= 28 && frame < 43;
  const isWordWild = isHeroWordPhase && frame >= 43;

  // Word phases for isChicu ("JEALOUS" -> "IN CHINESE")
  const isWordChicuJealous = isChicu && isHeroWordPhase && frame < 24;
  const isWordChicuInChinese = isChicu && isHeroWordPhase && frame >= 24;

  // Springs for each hero word
  const springChinese = spring({ frame, fps, config: { damping: 10, mass: 0.5, stiffness: 280 } });
  const springIs = spring({ frame: Math.max(0, frame - 28), fps, config: { damping: 10, mass: 0.5, stiffness: 280 } });
  const springWild = spring({ frame: Math.max(0, frame - 43), fps, config: { damping: 9, mass: 0.5, stiffness: 300 } });
  const springInChinese = spring({ frame: Math.max(0, frame - 24), fps, config: { damping: 10, mass: 0.5, stiffness: 280 } });

  // Camera Crash-Zoom Transition Spring (frames 75-105: ~1.25s to 1.75s)
  const heroRevealSpring = spring({
    frame: Math.max(0, frame - 75),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 180 },
  });

  // --- DYNAMIC SCENE TRANSITION SPRINGS ---
  const morph1To2 = spring({
    frame: Math.max(0, frame - screen1EndFrame),
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 160 },
  });

  const morph2To3 = spring({
    frame: Math.max(0, frame - screen2EndFrame),
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 160 },
  });

  const morph3To4 = spring({
    frame: Math.max(0, frame - screen3EndFrame),
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 160 },
  });

  // Camera Zoom dynamic pulses during transitions
  const transition1To2Zoom = isScreen2 && frame < screen1EndFrame + 30
    ? Math.sin((frame - screen1EndFrame) / 30 * Math.PI) * 0.12
    : 0;

  const transition2To3Zoom = isScreen3 && frame < screen2EndFrame + 30
    ? Math.sin((frame - screen2EndFrame) / 30 * Math.PI) * 0.14
    : 0;

  const transition3To4Zoom = isScreen4 && frame < screen3EndFrame + 30
    ? Math.sin((frame - screen3EndFrame) / 30 * Math.PI) * 0.08
    : 0;

  // Continuous subtle digital push-in across the whole video (0.04x / 4%)
  const continuousPush = 1 + (frame / lessonDurationInFrames) * 0.04;

  // Combined camera zoom scale (strictly clamped to >= 1.0 to eliminate black border gaps)
  const rawCameraZoom = isHeroWordPhase
    ? (isWordWild || isWordChicuInChinese ? interpolate(isChicu ? springInChinese : springWild, [0, 1], [1.35, 1.0]) : 1.0)
    : (interpolate(heroRevealSpring, [0, 1], [1.35, 1.0]) + transition1To2Zoom + transition2To3Zoom + transition3To4Zoom) * continuousPush;
  const cameraZoomScale = Math.max(1.0, rawCameraZoom);

  // Screen shake on Frame 0 and word impact
  const shake1 = frame < 15 ? Math.sin(frame * 1.8) * (1 - frame / 15) * 8 : 0;
  const shakeWild = (!isChicu && frame >= 43 && frame < 58) ? Math.sin((frame - 43) * 2.0) * (1 - (frame - 43) / 15) * 10 : 0;
  const shakeChicu = (isChicu && frame >= 24 && frame < 39) ? Math.sin((frame - 24) * 2.0) * (1 - (frame - 24) / 15) * 8 : 0;
  const totalShakeY = shake1 + shakeWild + shakeChicu;

  // Smoothly damped fracture pulse during hook tension (frames 95-155) - seamlessly returns to 0
  const relPulseFrame = frame - 95;
  const hookFracturePulse = isScreen1 && relPulseFrame >= 0 && relPulseFrame <= 60
    ? Math.sin(relPulseFrame * 0.15) * Math.sin((relPulseFrame / 60) * Math.PI) * 25
    : 0;

  const charSpacing = isKaishi || isXihuan || isDongxi || isChicu ? 120 : 150;
  const bangX =
    interpolate(morph1To2, [0, 1], [-charSpacing - hookFracturePulse, 0]) +
    interpolate(morph2To3, [0, 1], [0, -800]) +
    interpolate(morph3To4, [0, 1], [0, 800 - charSpacing]);

  const zhuX =
    interpolate(morph1To2, [0, 1], [charSpacing + hookFracturePulse, 800]) +
    interpolate(morph2To3, [0, 1], [0, -800]) +
    interpolate(morph3To4, [0, 1], [0, charSpacing]);

  const bangScale = (1 + interpolate(morph1To2, [0, 1], [0, 0.3]) - interpolate(morph2To3, [0, 1], [0, 0.3]));
  const zhuScale = (1 + interpolate(morph2To3, [0, 1], [0, 0.3]) - interpolate(morph3To4, [0, 1], [0, 0.3]));

  const anim = animationTimestamps || {
    screen1: {
      startFrame: 0,
      endFrame: screen1EndFrame,
      clothMention: { startFrame: 227, endFrame: 256 },
      wallMention: { startFrame: 273, endFrame: 298 },
      altarMention: { startFrame: 273, endFrame: 298 },
      muscleMention: { startFrame: 273, endFrame: 298 },
    },
    screen2: {
      startFrame: screen1EndFrame,
      endFrame: screen2EndFrame,
      topBang: { startFrame: screen1EndFrame, endFrame: 642 },
      bottomJin: { startFrame: 642, endFrame: 786 },
      wholeBang: { startFrame: 786, endFrame: screen2EndFrame },
    },
    screen3: {
      startFrame: screen2EndFrame,
      endFrame: screen3EndFrame,
      wholeZhuIntro: { startFrame: screen2EndFrame, endFrame: 1045 },
      leftQie: { startFrame: 1045, endFrame: 1126 },
      rightLi: { startFrame: 1126, endFrame: 1394 },
      wholeZhuOutro: { startFrame: 1304, endFrame: screen3EndFrame },
    },
    screen4: {
      startFrame: screen3EndFrame,
      endFrame: lessonDurationInFrames,
      bangHighlightEndFrame: 1601,
    },
  };

  const isScreen2TopBang = isScreen2 && frame >= anim.screen2.topBang.startFrame && frame < anim.screen2.topBang.endFrame;
  const isScreen2BottomJin = isScreen2 && frame >= anim.screen2.bottomJin.startFrame && frame < anim.screen2.bottomJin.endFrame;
  const isScreen2WholeBang = isScreen2 && frame >= anim.screen2.wholeBang.startFrame;

  const isScreen3WholeZhuIntro = isScreen3 && frame >= anim.screen3.wholeZhuIntro.startFrame && frame < anim.screen3.wholeZhuIntro.endFrame;
  const isScreen3LeftQie = isScreen3 && frame >= anim.screen3.leftQie.startFrame && frame < anim.screen3.leftQie.endFrame;
  const isScreen3RightLi = isScreen3 && frame >= anim.screen3.rightLi.startFrame && frame < anim.screen3.rightLi.endFrame;
  const isScreen3WholeZhu = isScreen3 && frame >= anim.screen3.wholeZhuOutro.startFrame;

  const isScreen4BangHighlight = isScreen4 && frame < anim.screen4.bangHighlightEndFrame;
  const isScreen4ZhuHighlight = isScreen4 && frame >= anim.screen4.bangHighlightEndFrame;

  let spot2X = 540;
  let spot2Y = isKaishi || isXihuan ? 240 : isJieshao ? 250 : isWangji ? 210 : isAiqing ? 220 : isPengyou ? 300 : 210;
  let spot2R = isKaishi || isXihuan ? 180 : 120;

  if (isChicu) {
    if (isScreen2TopBang) {
      // 口 (left)
      spot2X = 430;
      spot2Y = 160;
      spot2R = 95;
    } else if (isScreen2BottomJin) {
      // 乞 (right)
      spot2X = 590;
      spot2Y = 165;
      spot2R = 120;
    } else if (isScreen2WholeBang) {
      // 吃 (whole)
      spot2X = 540;
      spot2Y = 160;
      spot2R = 150;
    }
  } else if (isDongxi) {
    if (isScreen2TopBang) {
      spot2X = 540;
      spot2Y = 160;
      spot2R = 140;
    } else if (isScreen2BottomJin) {
      spot2X = 540;
      spot2Y = 160;
      spot2R = 150;
    } else if (isScreen2WholeBang) {
      spot2X = 540;
      spot2Y = 160;
      spot2R = 160;
    }
  } else if (isXihuan) {
    if (isScreen2TopBang) {
      spot2Y = 190;
      spot2R = 120;
    } else if (isScreen2BottomJin) {
      spot2Y = 320;
      spot2R = 110;
    } else if (isScreen2WholeBang) {
      spot2Y = 160;
      spot2R = 180;
    }
  } else if (isKaishi) {
    if (isScreen2TopBang) {
      spot2Y = 200;
      spot2R = 130;
    } else if (isScreen2WholeBang) {
      spot2Y = 160;
      spot2R = 180;
    }
  } else if (isAiqing) {
    if (isScreen2TopBang) {
      spot2Y = 200;
      spot2R = 120;
    } else if (isScreen2BottomJin) {
      spot2Y = 400;
      spot2R = 120;
    } else if (isScreen2WholeBang) {
      spot2Y = 300;
      spot2R = 230;
    }
  } else if (isPengyou) {
    if (isScreen2TopBang) {
      spot2X = 410;
      spot2Y = 300;
      spot2R = 140;
    } else if (isScreen2BottomJin) {
      spot2X = 660;
      spot2Y = 300;
      spot2R = 140;
    } else if (isScreen2WholeBang) {
      spot2X = 540;
      spot2Y = 300;
      spot2R = 230;
    }
  } else {
    if (isScreen2BottomJin) {
      spot2Y = 430;
      spot2R = 120;
    } else if (isScreen2WholeBang) {
      spot2Y = 300;
      spot2R = 230;
    }
  }

  let spot3X = 540;
  let spot3Y = isKaishi || isXihuan || isDongxi ? 240 : 300;
  let spot3R = isKaishi || isXihuan || isDongxi ? 180 : 230;

  if (isChicu) {
    if (isScreen3LeftQie) {
      // 酉 (left)
      spot3X = 440;
      spot3Y = 165;
      spot3R = 120;
    } else if (isScreen3RightLi) {
      // 昔 (right)
      spot3X = 600;
      spot3Y = 165;
      spot3R = 120;
    } else if (isScreen3WholeZhu) {
      // 醋 (whole)
      spot3X = 540;
      spot3Y = 160;
      spot3R = 150;
    }
  } else if (isDongxi) {
    if (isScreen3LeftQie) {
      spot3X = 540;
      spot3Y = 160;
      spot3R = 150;
    } else if (isScreen3RightLi) {
      spot3X = 540;
      spot3Y = 160;
      spot3R = 150;
    } else if (isScreen3WholeZhu) {
      spot3X = 540;
      spot3Y = 160;
      spot3R = 160;
    }
  } else if (isXihuan) {
    if (isScreen3LeftQie) {
      spot3X = 430;
      spot3Y = 160;
      spot3R = 110;
    } else if (isScreen3RightLi) {
      spot3X = 620;
      spot3Y = 160;
      spot3R = 110;
    } else if (isScreen3WholeZhu) {
      spot3X = 540;
      spot3Y = 160;
      spot3R = 150;
    }
  } else if (isKaishi) {
    if (isScreen3LeftQie) {
      spot3X = 430;
      spot3Y = 160;
      spot3R = 110;
    } else if (isScreen3RightLi) {
      spot3X = 620;
      spot3Y = 160;
      spot3R = 110;
    } else if (isScreen3WholeZhu) {
      spot3X = 540;
      spot3Y = 160;
      spot3R = 150;
    }
  } else if (isAiqing) {
    if (isScreen3LeftQie) {
      spot3X = 390;
      spot3R = 120;
    } else if (isScreen3RightLi) {
      spot3X = 620;
      spot3R = 120;
    }
  } else if (isPengyou) {
    if (isScreen3LeftQie) {
      spot3X = 540;
      spot3Y = 220;
      spot3R = 140;
    } else if (isScreen3RightLi) {
      spot3X = 540;
      spot3Y = 420;
      spot3R = 140;
    } else if (isScreen3WholeZhu) {
      spot3X = 540;
      spot3Y = 300;
      spot3R = 230;
    }
  } else {
    if (isScreen3LeftQie) {
      spot3X = 390;
      spot3R = 120;
    } else if (isScreen3RightLi) {
      spot3X = 620;
      spot3R = 120;
    }
  }

  const orbitBaseRadius = 320;
  const orbitSpeed = 0;

  const isMentionedCloth = isScreen1 && frame >= (anim.screen1.clothMention?.startFrame ?? 0);
  const isMentionedWall = isScreen1 && frame >= (anim.screen1.wallMention?.startFrame ?? 0);
  const isMentionedAltar = isScreen1 && frame >= (anim.screen1.altarMention?.startFrame ?? 0);
  const isMentionedMuscle = isScreen1 && frame >= (anim.screen1.muscleMention?.startFrame ?? 0);

  const clothSpring = spring({ frame: Math.max(0, frame - (anim.screen1.clothMention?.startFrame ?? 0)), fps, config: SPRING_BOUNCE });
  const wallSpring = spring({ frame: Math.max(0, frame - (anim.screen1.wallMention?.startFrame ?? 0)), fps, config: SPRING_BOUNCE });
  const altarSpring = spring({ frame: Math.max(0, frame - (anim.screen1.altarMention?.startFrame ?? 0)), fps, config: SPRING_BOUNCE });
  const muscleSpring = spring({ frame: Math.max(0, frame - (anim.screen1.muscleMention?.startFrame ?? 0)), fps, config: SPRING_BOUNCE });

  const emojisData = isChicu
    ? [
        { emoji: '🍜', label: '吃 (Eating)', angleOffset: -Math.PI / 4, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [0, 1.6]) : 0, active: isMentionedCloth },
        { emoji: '🍶', label: '醋 (Vinegar)', angleOffset: 5 * Math.PI / 4, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [0, 1.6]) : 0, active: isMentionedWall },
      ]
    : isDongxi
    ? [
        { emoji: '📦', label: '物 (Goods)', angleOffset: -Math.PI / 4, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [0, 1.6]) : 0, active: isMentionedCloth },
        { emoji: '🧭', label: '东西 (East & West)', angleOffset: 5 * Math.PI / 4, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [0, 1.6]) : 0, active: isMentionedWall },
      ]
    : isXihuan
    ? [
        { emoji: '🥁', label: '壴 (War Drum)', angleOffset: -Math.PI / 6, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [0, 1.5]) : 0, active: isMentionedCloth },
        { emoji: '🗣️', label: '口 (Singing Mouth)', angleOffset: -Math.PI / 3, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [0, 1.5]) : 0, active: isMentionedWall },
        { emoji: '🕊️', label: '雚 (Singing Bird)', angleOffset: 7 * Math.PI / 6, scale: isMentionedAltar ? interpolate(altarSpring, [0, 1], [0, 1.5]) : 0, active: isMentionedAltar },
        { emoji: '🎉', label: '欠 (Cheering)', angleOffset: 4 * Math.PI / 3, scale: isMentionedMuscle ? interpolate(muscleSpring, [0, 1], [0, 1.5]) : 0, active: isMentionedMuscle },
      ]
    : isKaishi
    ? [
        { emoji: '🚪', label: '门 (Gate)', angleOffset: -Math.PI / 6, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [0, 1.5]) : 0, active: isMentionedCloth },
        { emoji: '👩', label: '女 (Mother)', angleOffset: -Math.PI / 3, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [0, 1.5]) : 0, active: isMentionedWall },
        { emoji: '🌱', label: '始 (New Life)', angleOffset: 7 * Math.PI / 6, scale: isMentionedAltar ? interpolate(altarSpring, [0, 1], [0, 1.5]) : 0, active: isMentionedAltar },
      ]
    : isJieshao
    ? [
        { emoji: '⛩️', label: '八 (Boundaries)', angleOffset: -Math.PI / 6, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedWall },
        { emoji: '🧍', label: '人 (Person)', angleOffset: -Math.PI / 3, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedCloth },
        { emoji: '🧵', label: '纟 (Silk)', angleOffset: 7 * Math.PI / 6, scale: isMentionedAltar ? interpolate(altarSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedAltar },
      ]
    : isPengyou
    ? [
        { emoji: '🐚', label: '贝 (Shells)', angleOffset: -Math.PI / 6, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedCloth },
        { emoji: '♊', label: '月 (Moons)', angleOffset: -Math.PI / 3, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedWall },
        { emoji: '🖐️', label: '𠂇 (Reaching Hand)', angleOffset: 7 * Math.PI / 6, scale: isMentionedAltar ? interpolate(altarSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedAltar },
        { emoji: '🤝', label: '又 (Helping Hand)', angleOffset: 4 * Math.PI / 3, scale: isMentionedMuscle ? interpolate(muscleSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedMuscle },
      ]
    : [
        { emoji: '🏰', label: '邦 (Territory)', angleOffset: -Math.PI / 6, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedWall },
        { emoji: '🧵', label: '巾 (Cloth)', angleOffset: -Math.PI / 3, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedCloth },
        { emoji: '⛩️', label: '且 (Altar)', angleOffset: 7 * Math.PI / 6, scale: isMentionedAltar ? interpolate(altarSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedAltar },
        { emoji: '💪', label: '力 (Muscle)', angleOffset: 4 * Math.PI / 3, scale: isMentionedMuscle ? interpolate(muscleSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedMuscle },
      ];

  const bgmFadeOut = interpolate(frame, [lessonDurationInFrames - 60, lessonDurationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bgmVolume = 0.15 * bgmFadeOut;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily: 'Roboto, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* 1. Base solid safety bleed background preventing any black edges */}
      <div
        style={{
          position: 'absolute',
          top: -600,
          left: -600,
          width: 'calc(100% + 1200px)',
          height: 'calc(100% + 1200px)',
          backgroundColor: COLORS.bg,
          zIndex: 0,
        }}
      />

      {/* 2. Motion / Camera Layer with Crash Zoom, Scale & Shake */}
      <AbsoluteFill
        style={{
          transform: `translateY(${totalShakeY}px) scale(${cameraZoomScale})`,
          transformOrigin: '50% 40%',
          overflow: 'visible',
        }}
      >
        <Sequence from={0} durationInFrames={lessonDurationInFrames}>
          <ChineseBackground
            frame={frame}
            lessonTotalFrames={lessonDurationInFrames}
            morph1To2={morph1To2}
            morph2To3={morph2To3}
            morph3To4={morph3To4}
          />

        {/* SHOCKWAVE PULSES ON SCENE TRANSITIONS */}
        <ShockwaveRing triggerFrame={screen1EndFrame} frame={frame} x={540} y={400} color="#FF6F59" />
        <ShockwaveRing triggerFrame={screen2EndFrame} frame={frame} x={540} y={400} color="#FF6F59" />
        <ShockwaveRing triggerFrame={screen3EndFrame} frame={frame} x={540} y={400} color="#FF6F59" />

        {/* ============================================================ */}
        {/* HERO KINETIC WORDS TAKEOVER (0 to 75 frames / 0.0s to 1.25s) */}
        {/* ============================================================ */}
        {isHeroWordPhase && (
          <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }}>
            {isChicu ? (
              <>
                {isWordChicuJealous && (
                  <div style={{
                    transform: `scale(${interpolate(springChinese, [0, 1], [0.4, 1.15])})`,
                    fontFamily: FONTS.display,
                    fontSize: 140,
                    fontWeight: 900,
                    color: '#FF6F59',
                    letterSpacing: '0.04em',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    filter: 'drop-shadow(0 20px 50px rgba(255,111,89,0.7)) drop-shadow(0 0 30px rgba(255,111,89,0.9))'
                  }}>
                    <span>JEALOUS</span>
                    <span style={{ fontSize: 150 }}>😒</span>
                  </div>
                )}
                {isWordChicuInChinese && (
                  <div style={{
                    transform: `scale(${interpolate(springInChinese, [0, 1], [0.4, 1.05])})`,
                    fontFamily: FONTS.display,
                    fontSize: 110,
                    fontWeight: 900,
                    color: '#0F172A',
                    letterSpacing: '0.04em',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    filter: 'drop-shadow(0 15px 30px rgba(15,23,42,0.25))'
                  }}>
                    IN CHINESE
                  </div>
                )}
              </>
            ) : (
              <>
                {isWordChinese && (
                  <div style={{
                    transform: `scale(${interpolate(springChinese, [0, 1], [0.4, 1.0])})`,
                    fontFamily: FONTS.display,
                    fontSize: 140,
                    fontWeight: 900,
                    color: '#0F172A',
                    letterSpacing: '0.04em',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    filter: 'drop-shadow(0 20px 40px rgba(15,23,42,0.3))'
                  }}>
                    CHINESE
                  </div>
                )}
                {isWordIs && (
                  <div style={{
                    transform: `scale(${interpolate(springIs, [0, 1], [0.4, 1.0])})`,
                    fontFamily: FONTS.display,
                    fontSize: 140,
                    fontWeight: 900,
                    color: '#0F172A',
                    letterSpacing: '0.04em',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    filter: 'drop-shadow(0 20px 40px rgba(15,23,42,0.3))'
                  }}>
                    IS
                  </div>
                )}
                {isWordWild && (
                  <div style={{
                    transform: `scale(${interpolate(springWild, [0, 1], [0.4, 1.25])})`,
                    fontFamily: FONTS.display,
                    fontSize: 150,
                    fontWeight: 900,
                    color: '#FF6F59',
                    letterSpacing: '0.04em',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    filter: 'drop-shadow(0 20px 50px rgba(255,111,89,0.7)) drop-shadow(0 0 30px rgba(255,111,89,0.9))'
                  }}>
                    <span>WILD</span>
                    <span style={{ fontSize: 160 }}>🔥</span>
                  </div>
                )}
              </>
            )}
          </AbsoluteFill>
        )}

        <AbsoluteFill style={{ 
          padding: '30px 70px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          zIndex: 10,
          opacity: isHeroWordPhase ? 0 : interpolate(heroRevealSpring, [0, 1], [0, 1])
        }}>
          <FloatingParticles count={14} color="#FF6F59" />

          {/* TOP HEADER CONTAINER */}
          <div style={{ marginTop: 240, height: 150, textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}>
            {isScreen1 && (
              <div style={{
                backgroundColor: '#0F172A',
                padding: '16px 36px',
                borderRadius: 24,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '3px solid #FF6F59',
                transform: `translateY(${interpolate(spring({ frame: Math.max(0, frame - 75), fps, config: SPRING_OVERSHOOT }), [0, 1], [-50, 0])}px)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6
              }}>
                <h1 style={{ fontFamily: FONTS.display, fontSize: 48, color: '#FF6F59', margin: 0, fontWeight: 900, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  {isChicu ? (
                    frame >= 271 ? 'BUT WHY? 🤔' : frame >= 169 ? 'LITERALLY: EATING VINEGAR 🍶' : 'JEALOUS 😒'
                  ) : isDongxi ? (
                    'THINGS 📦'
                  ) : (
                    'CHINESE IS WILD 🔥'
                  )}
                </h1>
                <div style={{ fontFamily: FONTS.display, fontSize: 28, color: '#FFFFFF', fontWeight: 700 }}>
                  {isChicu ? (
                    frame >= 271 ? (
                      <span>Why does <span style={{ color: '#FF6F59' }}>{character}</span> mean Jealousy?!</span>
                    ) : frame >= 169 ? (
                      <span>Eating (<span style={{ color: '#FF6F59' }}>吃</span>) + Vinegar (<span style={{ color: '#FF6F59' }}>醋</span>)</span>
                    ) : (
                      <span>In Chinese: <span style={{ color: '#FF6F59' }}>{character} (chī cù)</span></span>
                    )
                  ) : isDongxi ? (
                    <span>Why <span style={{ color: '#FF6F59' }}>{character}</span> = East + West = Things?!</span>
                  ) : (
                    <span>Why <span style={{ color: '#FF6F59' }}>{character}</span> = War Drum + Cheering!</span>
                  )}
                </div>
              </div>
            )}
            {isScreen2 && (
              <div style={{
                transform: `scale(${interpolate(morph1To2, [0, 0.5, 1], [0.85, 1.05, 1.0])})`,
                transition: 'transform 0.2s ease',
              }}>
                <h2 style={{ fontFamily: FONTS.display, fontSize: 38, color: '#0F172A', margin: 0, lineHeight: 1.25, maxWidth: 820 }}>
                  Character 1: <span style={{ color: '#FF6F59' }}>{char1} ({isChicu ? 'chī' : isDongxi ? 'dōng' : isXihuan ? 'xǐ' : isKaishi ? 'kāi' : isJieshao ? 'jiè' : isWangji ? 'wàng' : isAiqing ? 'ài' : isPengyou ? 'péng' : 'bāng'})</span> — {isChicu ? 'Open Mouth & Begging for Food' : isDongxi ? 'Sunrise & Travel Sack' : isXihuan ? 'Celebratory War Drum' : isKaishi ? 'Opening the Gate' : isJieshao ? 'Go-Between' : isWangji ? 'Disappearing Heart' : isAiqing ? 'Hand Embracing Friend' : isPengyou ? 'Twin Companions' : 'Protective Backing'}
                </h2>
              </div>
            )}
            {isScreen3 && (
              <div style={{
                transform: `scale(${interpolate(morph2To3, [0, 0.5, 1], [0.85, 1.05, 1.0])})`,
                transition: 'transform 0.2s ease',
              }}>
                <h2 style={{ fontFamily: FONTS.display, fontSize: 38, color: '#0F172A', margin: 0, lineHeight: 1.25, maxWidth: 820 }}>
                  Character 2: <span style={{ color: '#FF6F59' }}>{char2} ({isChicu ? 'cù' : isDongxi ? 'xī' : isXihuan ? 'huān' : isKaishi ? 'shǐ' : isJieshao ? 'shào' : isWangji ? 'jì' : isAiqing ? 'qíng' : isPengyou ? 'yǒu' : 'zhù'})</span> — {isChicu ? 'Wine Jar & Fermented Vinegar' : isDongxi ? 'Sunset & Bird in Nest' : isXihuan ? 'Singing Bird & Cheering' : isKaishi ? 'New Life & Origin' : isJieshao ? 'Linking Thread' : isWangji ? 'Recording Words' : isAiqing ? 'Youthful Heart' : isPengyou ? 'Helping Hands' : 'Muscle Power'}
                </h2>
              </div>
            )}
            {isScreen4 && (
              <div style={{
                transform: `scale(${interpolate(morph3To4, [0, 0.5, 1], [0.85, 1.05, 1.0])})`,
                transition: 'transform 0.2s ease',
              }}>
                <h2 style={{ fontFamily: FONTS.display, fontSize: 38, color: '#0F172A', margin: 0, lineHeight: 1.25, maxWidth: 820 }}>
                  Synthesis: <span style={{ color: '#FF6F59' }}>{character}</span> = {isChicu ? 'Drinking Vinegar = Romantic Jealousy!' : isDongxi ? 'East Market + West Market!' : isXihuan ? 'Victory Drum + Joyful Cheering!' : isKaishi ? 'Opening Gates + Giving Birth!' : isJieshao ? 'Connecting Two Parties!' : isWangji ? 'Disappearing from Memory!' : isAiqing ? 'Blossoming Affection!' : isPengyou ? 'Companions + Helping Hands!' : 'Protection + Muscle!'}
                </h2>
              </div>
            )}
          </div>

          {/* MAIN CHARACTER STAGE */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 320,
              marginTop: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                transform: `translateX(${bangX}px) scale(${bangScale})`,
                fontSize: 210,
                fontWeight: 900,
                fontFamily: '"Noto Sans SC", sans-serif',
                color: isScreen4BangHighlight || isScreen2 ? '#FF6F59' : '#0F172A',
                textShadow: isScreen2 || isScreen4BangHighlight ? '0 16px 50px rgba(255, 111, 89, 0.45)' : '0 10px 30px rgba(15,23,42,0.1)',
                transition: 'color 0.25s ease, text-shadow 0.25s ease',
              }}
            >
              {char1}
            </div>

            <div
              style={{
                position: 'absolute',
                transform: `translateX(${zhuX}px) scale(${zhuScale})`,
                fontSize: 210,
                fontWeight: 900,
                fontFamily: '"Noto Sans SC", sans-serif',
                color: isScreen4ZhuHighlight || isScreen3 ? '#FF6F59' : '#0F172A',
                textShadow: isScreen3 || isScreen4ZhuHighlight ? '0 16px 50px rgba(255, 111, 89, 0.45)' : '0 10px 30px rgba(15,23,42,0.1)',
                transition: 'color 0.25s ease, text-shadow 0.25s ease',
              }}
            >
              {char2}
            </div>

            {isScreen1 &&
              emojisData.map((item, i) => {
                const currentAngle = orbitSpeed + item.angleOffset;
                const emojiX = Math.cos(currentAngle) * orbitBaseRadius;
                const emojiY = Math.sin(currentAngle) * (orbitBaseRadius * 0.55);

                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      transform: `translate(${emojiX}px, ${emojiY}px) scale(${item.scale})`,
                      fontSize: 76,
                      filter: item.active
                        ? 'drop-shadow(0 12px 28px rgba(255, 111, 89, 0.95)) drop-shadow(0 0 24px rgba(255, 111, 89, 0.8))'
                        : 'drop-shadow(0 6px 14px rgba(0,0,0,0.18))',
                      transition: 'filter 0.25s ease',
                      zIndex: 30,
                    }}
                  >
                    {item.emoji}
                  </div>
                );
              })}

            {isScreen2 && <DynamicSmoothSpotlight x={spot2X} y={spot2Y} radius={spot2R} frame={frame} />}
            {isScreen3 && <DynamicSmoothSpotlight x={spot3X} y={spot3Y} radius={spot3R} frame={frame} />}

            {isScreen4 && (
              <div
                style={{
                  position: 'absolute',
                  width: 520,
                  height: 350,
                  borderRadius: 40,
                  border: '4px solid #FF6F59',
                  backgroundColor: 'rgba(255, 111, 89, 0.1)',
                  boxShadow: '0 0 80px rgba(255, 111, 89, 0.45)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>

          {/* SCENE 1 CARD */}
          {isChicu ? (
            <OrganicCenterTag
              emoji="🍶"
              radical="吃醋"
              pinyin="chī cù"
              translation="Eating Vinegar = Jealousy"
              catImages={[
                'cats/chicu/cat_chicu_f1.png',
                'cats/chicu/cat_chicu_f2.png',
              ]}
              frame={frame}
              enterFrame={75}
              exitFrame={anim.screen1.endFrame}
            />
          ) : isDongxi ? (
            <OrganicCenterTag
              emoji="📦"
              radical="东西"
              pinyin="dōng xi"
              translation="Things & Objects"
              catImages={[
                'cats/dongxi/cat_dongxi_f1.png',
                'cats/dongxi/cat_dongxi_f2.png',
              ]}
              frame={frame}
              enterFrame={75}
              exitFrame={anim.screen1.endFrame}
            />
          ) : isXihuan ? (
            <OrganicCenterTag
              emoji="💖"
              radical="喜欢"
              pinyin="xǐ huan"
              translation="To Like / Love"
              catImages={[
                'cats/xihuan/cat_xihuan_f1.png',
                'cats/xihuan/cat_xihuan_f2.png',
              ]}
              frame={frame}
              enterFrame={75}
              exitFrame={anim.screen1.endFrame}
            />
          ) : isKaishi ? (
            <OrganicCenterTag
              emoji="🏁"
              radical="开始"
              pinyin="kāi shǐ"
              translation="To Begin / Start"
              catImages={[
                'cats/kaishi/cat_kaishi_f1.png',
                'cats/kaishi/cat_kaishi_f2.png',
                'cats/kaishi/cat_kaishi_f3.png',
              ]}
              frame={frame}
              enterFrame={0}
              exitFrame={anim.screen1.endFrame}
            />
          ) : isPengyou ? (
            <OrganicCenterTag
              emoji="🤝"
              radical="朋友"
              pinyin="péng you"
              translation="Twin Companions & Mutual Support"
              catImages={[
                'cats/cat_pengyou_word_frame_1.png',
                'cats/cat_pengyou_word_frame_2.png',
                'cats/cat_pengyou_word_frame_3.png',
              ]}
              frame={frame}
              enterFrame={0}
              exitFrame={anim.screen1.endFrame}
            />
          ) : (
            <OrganicCenterTag
              emoji="🤝"
              radical="帮助"
              pinyin="bāng zhù"
              translation="Mutual Assistance & Protection"
              catImages={[
                'cats/cat_bangzhu_word_frame_1.png',
                'cats/cat_bangzhu_word_frame_2.png',
                'cats/cat_bangzhu_word_frame_3.png',
              ]}
              frame={frame}
              enterFrame={0}
              exitFrame={anim.screen1.endFrame}
            />
          )}

          {/* SCENE 2 CARDS */}
          {isChicu ? (
            <>
              <OrganicCenterTag
                emoji="👄"
                radical="口"
                pinyin="kǒu"
                translation="Open Mouth"
                catImages={[
                  'cats/chicu/cat_mouth_f1.png',
                  'cats/chicu/cat_mouth_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.startFrame}
                exitFrame={anim.screen2.topBang.endFrame}
              />
              <OrganicCenterTag
                emoji="🥺"
                radical="乞"
                pinyin="qǐ"
                translation="Begging for Food"
                catImages={[
                  'cats/chicu/cat_beg_f1.png',
                  'cats/chicu/cat_beg_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.topBang.endFrame}
                exitFrame={anim.screen2.bottomJin.endFrame}
              />
              <OrganicCenterTag
                emoji="😋"
                radical="吃"
                pinyin="chī"
                translation="Swallowing & Eating Food"
                catImages={[
                  'cats/chicu/cat_eat_f1.png',
                  'cats/chicu/cat_eat_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.bottomJin.endFrame}
                exitFrame={anim.screen2.endFrame}
              />
            </>
          ) : isDongxi ? (
            <>
              <OrganicCenterTag
                emoji="🌅"
                radical="东"
                pinyin="dōng"
                translation="Travel Sack on Carrying Pole"
                catImages={[
                  'cats/dongxi/cat_dong_f1.png',
                  'cats/dongxi/cat_dong_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.startFrame}
                exitFrame={anim.screen2.topBang.endFrame}
              />
              <OrganicCenterTag
                emoji="☀️"
                radical="东"
                pinyin="dōng"
                translation="Sunrise in the East"
                catImages={[
                  'cats/dongxi/cat_dong_f1.png',
                  'cats/dongxi/cat_dong_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.topBang.endFrame}
                exitFrame={anim.screen2.endFrame}
              />
            </>
          ) : isXihuan ? (
            <>
              <OrganicCenterTag
                emoji="🥁"
                radical="壴"
                pinyin="zhù"
                translation="Celebratory War Drum"
                catImages={[
                  'cats/xihuan/cat_drum_f1.png',
                  'cats/xihuan/cat_drum_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.startFrame}
                exitFrame={anim.screen2.topBang.endFrame}
              />
              <OrganicCenterTag
                emoji="🗣️"
                radical="口"
                pinyin="kǒu"
                translation="Singing Mouth"
                catImages={[
                  'cats/xihuan/cat_sing_f1.png',
                  'cats/xihuan/cat_sing_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.topBang.endFrame}
                exitFrame={anim.screen2.bottomJin.endFrame}
              />
              <OrganicCenterTag
                emoji="🏆"
                radical="喜"
                pinyin="xǐ"
                translation="Victory Celebration"
                catImages={[
                  'cats/xihuan/cat_victory_f1.png',
                  'cats/xihuan/cat_victory_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.bottomJin.endFrame}
                exitFrame={anim.screen2.endFrame}
              />
            </>
          ) : isKaishi ? (
            <>
              <OrganicCenterTag
                emoji="🚪"
                radical="门/开"
                pinyin="kāi"
                translation="Unlatching the Gate"
                catImages={[
                  'cats/kaishi/cat_gate_f1.png',
                  'cats/kaishi/cat_gate_f2.png',
                  'cats/kaishi/cat_gate_f3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.startFrame}
                exitFrame={anim.screen2.topBang.endFrame}
              />
              <OrganicCenterTag
                emoji="🚀"
                radical="开"
                pinyin="kāi"
                translation="Opening a Clear Path"
                catImages={[
                  'cats/kaishi/cat_open_f1.png',
                  'cats/kaishi/cat_open_f2.png',
                  'cats/kaishi/cat_open_f3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.topBang.endFrame}
                exitFrame={anim.screen2.endFrame}
              />
            </>
          ) : isPengyou ? (
            <>
              <OrganicCenterTag
                emoji="🐚"
                radical="贝/朋"
                pinyin="péng"
                translation="Strings of Shells & Jade"
                catImages={[
                  'cats/cat_peng_left_frame_1.png',
                  'cats/cat_peng_left_frame_2.png',
                  'cats/cat_peng_left_frame_3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.topBang.startFrame}
                exitFrame={anim.screen2.topBang.endFrame}
              />
              <OrganicCenterTag
                emoji="♊"
                radical="月+月"
                pinyin="yuè"
                translation="Twin Moons Side-by-Side"
                catImages={[
                  'cats/cat_peng_right_frame_1.png',
                  'cats/cat_peng_right_frame_2.png',
                  'cats/cat_peng_right_frame_3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.bottomJin.startFrame}
                exitFrame={anim.screen2.bottomJin.endFrame}
              />
              <OrganicCenterTag
                emoji="👬"
                radical="朋"
                pinyin="péng"
                translation="Equal Companions Side-by-Side"
                catImages={[
                  'cats/cat_peng_whole_frame_1.png',
                  'cats/cat_peng_whole_frame_2.png',
                  'cats/cat_peng_whole_frame_3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.wholeBang.startFrame}
                exitFrame={anim.screen2.wholeBang.endFrame}
              />
            </>
          ) : (
            <>
              <OrganicCenterTag
                emoji="🏰"
                radical="邦"
                pinyin="bāng"
                translation="Territory & Community"
                catImages={[
                  'cats/cat_bang_top_frame_1.png',
                  'cats/cat_bang_top_frame_2.png',
                  'cats/cat_bang_top_frame_3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.topBang.startFrame}
                exitFrame={anim.screen2.topBang.endFrame}
              />
              <OrganicCenterTag
                emoji="🧵"
                radical="巾"
                pinyin="jīn"
                translation="Reinforcing Cloth Strip"
                catImages={[
                  'cats/cat_bang_bottom_1.png',
                  'cats/cat_bang_bottom_frame_2.png',
                  'cats/cat_bang_bottom_frame_3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.bottomJin.startFrame}
                exitFrame={anim.screen2.bottomJin.endFrame}
              />
              <OrganicCenterTag
                emoji="🛡️"
                radical="帮"
                pinyin="bāng"
                translation="Protective Shoe Backing"
                catImages={[
                  'cats/cat_bang_whole_frame_1.png',
                  'cats/cat_bang_whole_frame_2.png',
                  'cats/cat_bang_whole_frame_3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.wholeBang.startFrame}
                exitFrame={anim.screen2.wholeBang.endFrame}
              />
            </>
          )}

          {/* SCENE 3 CARDS */}
          {isChicu ? (
            <>
              <OrganicCenterTag
                emoji="🏺"
                radical="酉"
                pinyin="yǒu"
                translation="Ancient Wine Jar"
                catImages={[
                  'cats/chicu/cat_jar_f1.png',
                  'cats/chicu/cat_jar_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.startFrame}
                exitFrame={anim.screen3.leftQie.endFrame}
              />
              <OrganicCenterTag
                emoji="⏳"
                radical="昔"
                pinyin="xī"
                translation="Sun Over Past Days"
                catImages={[
                  'cats/chicu/cat_time_f1.png',
                  'cats/chicu/cat_time_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.leftQie.endFrame}
                exitFrame={anim.screen3.rightLi.endFrame}
              />
              <OrganicCenterTag
                emoji="😖"
                radical="醋"
                pinyin="cù"
                translation="Aged Sour Vinegar"
                catImages={[
                  'cats/chicu/cat_sour_f1.png',
                  'cats/chicu/cat_sour_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.rightLi.endFrame}
                exitFrame={anim.screen3.endFrame}
              />
            </>
          ) : isDongxi ? (
            <>
              <OrganicCenterTag
                emoji="🌇"
                radical="西"
                pinyin="xī"
                translation="Sunset & Bird in Woven Nest"
                catImages={[
                  'cats/dongxi/cat_xi_f1.png',
                  'cats/dongxi/cat_xi_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.startFrame}
                exitFrame={anim.screen3.endFrame}
              />
            </>
          ) : isXihuan ? (
            <>
              <OrganicCenterTag
                emoji="🕊️"
                radical="又/雚"
                pinyin="huān"
                translation="Singing Bird"
                catImages={[
                  'cats/xihuan/cat_bird_f1.png',
                  'cats/xihuan/cat_bird_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.startFrame}
                exitFrame={anim.screen3.leftQie.endFrame}
              />
              <OrganicCenterTag
                emoji="🎉"
                radical="欠"
                pinyin="qiàn"
                translation="Cheering & Gasping"
                catImages={[
                  'cats/xihuan/cat_gasp_f1.png',
                  'cats/xihuan/cat_gasp_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.leftQie.endFrame}
                exitFrame={anim.screen3.rightLi.endFrame}
              />
              <OrganicCenterTag
                emoji="🥳"
                radical="欢"
                pinyin="huān"
                translation="Joyful Ecstasy"
                catImages={[
                  'cats/xihuan/cat_cheer_f1.png',
                  'cats/xihuan/cat_cheer_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.rightLi.endFrame}
                exitFrame={anim.screen3.endFrame}
              />
            </>
          ) : isKaishi ? (
            <>
              <OrganicCenterTag
                emoji="👩"
                radical="女"
                pinyin="nǚ"
                translation="Woman / Mother"
                catImages={[
                  'cats/kaishi/cat_woman_f1.png',
                  'cats/kaishi/cat_woman_f2.png',
                  'cats/kaishi/cat_woman_f3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.startFrame}
                exitFrame={anim.screen3.leftQie.endFrame}
              />
              <OrganicCenterTag
                emoji="🗣️"
                radical="台"
                pinyin="tái"
                translation="Platform (Sound)"
                catImages={[
                  'cats/kaishi/cat_origin_f1.png',
                  'cats/kaishi/cat_origin_f2.png',
                  'cats/kaishi/cat_origin_f3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.leftQie.endFrame}
                exitFrame={anim.screen3.rightLi.endFrame}
              />
              <OrganicCenterTag
                emoji="🌱"
                radical="始"
                pinyin="shǐ"
                translation="Origin of Life / Birth"
                catImages={[
                  'cats/kaishi/cat_birth_f1.png',
                  'cats/kaishi/cat_birth_f2.png',
                  'cats/kaishi/cat_birth_f3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.rightLi.endFrame}
                exitFrame={anim.screen3.endFrame}
              />
            </>
          ) : isPengyou ? (
            <>
              <OrganicCenterTag
                emoji="🖐️"
                radical="𠂇"
                pinyin="yòu"
                translation="Hand Reaching Out to Help"
                catImages={[
                  'cats/cat_you_top_frame_1.png',
                  'cats/cat_you_top_frame_2.png',
                  'cats/cat_you_top_frame_3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.leftQie.startFrame}
                exitFrame={anim.screen3.leftQie.endFrame}
              />
              <OrganicCenterTag
                emoji="🤝"
                radical="又"
                pinyin="yòu"
                translation="Hand Extending Mutual Aid"
                catImages={[
                  'cats/cat_you_bottom_frame_1.png',
                  'cats/cat_you_bottom_frame_2.png',
                  'cats/cat_you_bottom_frame_3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.rightLi.startFrame}
                exitFrame={anim.screen3.rightLi.endFrame}
              />
              <OrganicCenterTag
                emoji="🤛"
                radical="友"
                pinyin="yǒu"
                translation="True Friends Supporting Each Other"
                catImages={[
                  'cats/cat_you_intro_frame_1.png',
                  'cats/cat_you_whole_frame_2.png',
                  'cats/cat_you_whole_frame_3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.wholeZhuOutro.startFrame}
                exitFrame={anim.screen3.wholeZhuOutro.endFrame}
              />
            </>
          ) : (
            <>
              <OrganicCenterTag
                emoji="⛩️"
                radical="且"
                pinyin="zhǔ"
                translation="Heavy Altar Pedestal"
                catImages={[
                  'cats/cat_zhu_left_frame_1.png',
                  'cats/cat_zhu_left_frame_2.png',
                  'cats/cat_zhu_left_frame_3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.leftQie.startFrame}
                exitFrame={anim.screen3.leftQie.endFrame}
              />
              <OrganicCenterTag
                emoji="💪"
                radical="力"
                pinyin="lì"
                translation="Muscle Power & Labor"
                catImages={[
                  'cats/cat_zhu_right_frame_1.png',
                  'cats/cat_zhu_right_frame_2.png',
                  'cats/cat_zhu_right_frame_3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.rightLi.startFrame}
                exitFrame={anim.screen3.rightLi.endFrame}
              />
              <OrganicCenterTag
                emoji="🏋️"
                radical="助"
                pinyin="zhù"
                translation="Lending Teamwork Strength"
                catImages={[
                  'cats/cat_zhu_whole_1.png',
                  'cats/cat_bangzhu_word_frame_2.png',
                  'cats/cat_bangzhu_word_frame_3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.wholeZhuOutro.startFrame}
                exitFrame={anim.screen3.wholeZhuOutro.endFrame}
              />
            </>
          )}

          {/* SCENE 4 CARD */}
          {isChicu ? (
            <OrganicCenterTag
              emoji="👑"
              radical="吃醋"
              pinyin="chī cù"
              translation="Loyal Wife's Vinegar Test = Jealousy!"
              catImages={[
                'cats/chicu/cat_jealous_f1.png',
                'cats/chicu/cat_jealous_f2.png',
              ]}
              frame={frame}
              enterFrame={anim.screen4.startFrame}
              exitFrame={anim.screen4.endFrame}
            />
          ) : isDongxi ? (
            <OrganicCenterTag
              emoji="🛍️"
              radical="东西"
              pinyin="dōng xi"
              translation="East & West Markets = Buying Goods!"
              catImages={[
                'cats/dongxi/cat_market_f1.png',
                'cats/dongxi/cat_market_f2.png',
              ]}
              frame={frame}
              enterFrame={anim.screen4.startFrame}
              exitFrame={anim.screen4.endFrame}
            />
          ) : isXihuan ? (
            <OrganicCenterTag
              emoji="💖"
              radical="喜欢"
              pinyin="xǐ huan"
              translation="Victory Drum + Joyful Cheering = Love!"
              catImages={[
                'cats/xihuan/cat_xihuan_f1.png',
                'cats/xihuan/cat_xihuan_f2.png',
              ]}
              frame={frame}
              enterFrame={anim.screen4.startFrame}
              exitFrame={anim.screen4.endFrame}
            />
          ) : isKaishi ? (
            <OrganicCenterTag
              emoji="🏁"
              radical="开始"
              pinyin="kāi shǐ"
              translation="Unlatch Gate + New Life = Start!"
              catImages={[
                'cats/kaishi/cat_kaishi_f1.png',
                'cats/kaishi/cat_kaishi_f2.png',
                'cats/kaishi/cat_kaishi_f3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen4.startFrame}
              exitFrame={anim.screen4.endFrame}
            />
          ) : isPengyou ? (
            <OrganicCenterTag
              emoji="🤝"
              radical="朋友"
              pinyin="péng you"
              translation="Companions Extending Helping Hands"
              catImages={[
                'cats/cat_pengyou_word_frame_1.png',
                'cats/cat_pengyou_word_frame_2.png',
                'cats/cat_pengyou_word_frame_3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen4.startFrame}
              exitFrame={anim.screen4.endFrame}
            />
          ) : (
            <OrganicCenterTag
              emoji="🤝"
              radical="帮助"
              pinyin="bāng zhù"
              translation="Mutual Assistance & Protection"
              catImages={[
                'cats/cat_bangzhu_word_frame_1.png',
                'cats/cat_bangzhu_word_frame_2.png',
                'cats/cat_bangzhu_word_frame_3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen4.startFrame}
              exitFrame={anim.screen4.endFrame}
            />
          )}

          {wordsAlignment && wordsAlignment.length > 0 && (
            <RealtimeCaptions words={wordsAlignment} positionBottom={440} />
          )}
        </AbsoluteFill>

        {/* SFX: IMPACT BOOM ON FRAME 0 */}
        <Sequence from={0} durationInFrames={40}>
          <Audio src={staticFile('sfx_hit.mp3')} volume={0.4} />
        </Sequence>

        {/* SFX: POP ON WILD WORD IMPACT (Frame 43) */}
        <Sequence from={43} durationInFrames={20}>
          <Audio src={staticFile('sfx_pop.mp3')} volume={0.6} />
        </Sequence>

        {/* SFX: WHOOSH ON SCENE TRANSITIONS */}
        <Sequence from={screen1EndFrame} durationInFrames={25}>
          <Audio src={staticFile('sfx_whoosh.mp3')} volume={0.45} />
        </Sequence>
        <Sequence from={screen2EndFrame} durationInFrames={25}>
          <Audio src={staticFile('sfx_whoosh.mp3')} volume={0.45} />
        </Sequence>
        <Sequence from={screen3EndFrame} durationInFrames={25}>
          <Audio src={staticFile('sfx_whoosh.mp3')} volume={0.45} />
        </Sequence>

        {/* SFX: POP ON RADICAL EMOJI APPEARANCES */}
        {anim.screen1.clothMention && (
          <Sequence from={anim.screen1.clothMention.startFrame} durationInFrames={20}>
            <Audio src={staticFile('sfx_pop.mp3')} volume={0.5} />
          </Sequence>
        )}
        {anim.screen1.wallMention && (
          <Sequence from={anim.screen1.wallMention.startFrame} durationInFrames={20}>
            <Audio src={staticFile('sfx_pop.mp3')} volume={0.5} />
          </Sequence>
        )}

        {audioSrc && <Audio src={staticFile(audioSrc)} />}
      </Sequence>

      {bgmAudioSrc && <Audio src={staticFile(bgmAudioSrc)} volume={bgmVolume} loop />}

      {outroDurationInFrames > 0 && (
        <Sequence from={lessonDurationInFrames} durationInFrames={outroDurationInFrames}>
          <KanshuAppOutro showAudio={true} audioSrc={outroAudioSrc} />
        </Sequence>
      )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
