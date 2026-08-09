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
    clothMention: AnimationPhase;
    wallMention: AnimationPhase;
    altarMention: AnimationPhase;
    muscleMention: AnimationPhase;
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

// ────────────────────────────────────────────────────────────
// HIGH-CONTRAST DEEP BLACK DYNAMICALLY-SCALING TARGET SPOTLIGHT
// ULTRA-SMOOTH SPRING-LIKE CUBIC-BEZIER PHYSICS & SNUG FINGER PLACEMENT
// ────────────────────────────────────────────────────────────

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
        transition: 'top 0.55s cubic-bezier(0.16, 1, 0.3, 1), left 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* HIGH-CONTRAST DEEP BLACK DASHED CIRCLE */}
      <svg
        width={radius * 2 + 40}
        height={radius * 2 + 40}
        viewBox={`0 0 ${radius * 2 + 40} ${radius * 2 + 40}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: 'width 0.55s cubic-bezier(0.16, 1, 0.3, 1), height 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
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
            transition: 'r 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>

      {/* Pointer Arrow 👇 (SNUGLY POSITIONED CLOSE TO CIRCLE BORDER: top: -(radius - 15)) */}
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
          transition: 'top 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <span>👇</span>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// COMPACT 2-LINE DARK CARD TAG WITH BORDERLESS TRANSPARENT CAT SKETCH ANIMATION
// ATOMIC UNIFIED DRIFT & FLIPBOOK ANIMATION LOOP (3-4 FPS)
// ────────────────────────────────────────────────────────────

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

  // Entrance Spring (Move in from Left: -1400px -> 0px)
  const enterSpring = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 18, mass: 0.8, stiffness: 140 },
  });

  // Exit Spring (Move out to Right: 0px -> +1400px completely off-screen!)
  const exitSpring = spring({
    frame: Math.max(0, frame - exitFrame),
    fps,
    config: { damping: 18, mass: 0.8, stiffness: 140 },
  });

  const enterX = interpolate(enterSpring, [0, 1], [-1400, 0], { easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
  const exitX = frame >= exitFrame ? interpolate(exitSpring, [0, 1], [0, 1400], { easing: Easing.bezier(0.25, 0.1, 0.25, 1) }) : 0;

  const currentX = enterX + exitX;

  // Unified atomic drift on outer container wrapper only
  const driftY = Math.sin((frame - enterFrame) * 0.08) * 1.5;

  // Authentic 6 FPS Ping-Pong Flipbook frame cycling (0 -> 1 -> 2 -> 1)
  // Each frame lasts exactly 10 video frames (1/6th second) regardless of enterFrame offset
  const cycleIndex = Math.floor(frame / 10) % 4;
  // Map 0, 1, 2, 3 to frame indices: 0 -> 0, 1 -> 1, 2 -> 2, 3 -> 1
  const pingPongMap = [0, 1, 2, 1];
  const flipIndex = pingPongMap[cycleIndex] % catImages.length;
  const currentCatSrc = catImages[flipIndex] || catImages[0];

  if (frame < enterFrame || (frame >= exitFrame && exitSpring >= 0.99)) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 940, // Positioned at top: 940px
        left: '50%',
        transform: `translateX(calc(-50% + ${currentX}px)) translateY(${driftY}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        zIndex: 90,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {/* COMPACT SLIMMER DARK CARD: Radical + Pinyin + Translation */}
      <div
        style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '14px 38px',
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
        {/* LINE 1: Emoji + Hanzi Radical + Roboto Pinyin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 38 }}>{emoji}</span>
          <span style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 40, fontWeight: 900, color: '#FFFFFF' }}>
            {radical}
          </span>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 28, fontWeight: 700, color: '#94A3B8', fontStyle: 'italic' }}>
            ({pinyin})
          </span>
        </div>

        {/* LINE 2: Finger Paint Font ALL CAPS Translation */}
        <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 700, color: '#FF6F59', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {translation}
        </div>
      </div>

      {/* PROMINENT BIGGER BORDERLESS TRANSPARENT CAT SKETCH ANIMATION BELOW */}
      {currentCatSrc && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 6,
          }}
        >
          <img
            src={staticFile(currentCatSrc)}
            alt="Borderless Transparent Cat Sketch"
            style={{
              height: 380,
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 20px rgba(15, 23, 42, 0.18))',
            }}
          />
        </div>
      )}
    </div>
  );
};

export const EtymologyTemplate: React.FC<EtymologyConfig> = ({
  character = '帮助',
  pinyin = 'bāng zhù',
  meaning = 'To Help / Assistance',
  audioSrc = 'bangzhu_voice_injected.mp3',
  bgmAudioSrc = 'chinese_lofi_bgm.mp3',
  outroAudioSrc = 'kanshu_outro_elevenlabs.mp3',
  wordsAlignment = [],
  screenTimestamps = {
    screen1EndFrame: 414,
    screen2EndFrame: 1507,
    screen3EndFrame: 2458,
    lessonTotalFrames: 2772,
  },
  animationTimestamps,
  lessonDurationInFrames = 2772,
  outroDurationInFrames = 425,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Extract dynamic audio transition frames
  const { screen1EndFrame, screen2EndFrame, screen3EndFrame, lessonTotalFrames } = screenTimestamps;

  // ── FLUID MORPHING POSITION ANIMATIONS BETWEEN SCREENS ──
  const morph1To2 = spring({
    frame: Math.max(0, frame - screen1EndFrame),
    fps,
    config: SPRING_SMOOTH,
  });

  const morph2To3 = spring({
    frame: Math.max(0, frame - screen2EndFrame),
    fps,
    config: SPRING_SMOOTH,
  });

  const morph3To4 = spring({
    frame: Math.max(0, frame - screen3EndFrame),
    fps,
    config: SPRING_SMOOTH,
  });

  // Dynamic X positions for intact Chinese characters '帮' and '助'
  const bangX =
    interpolate(morph1To2, [0, 1], [-150, 0]) +
    interpolate(morph2To3, [0, 1], [0, -800]) +
    interpolate(morph3To4, [0, 1], [0, 650]);

  const zhuX =
    interpolate(morph1To2, [0, 1], [150, 800]) +
    interpolate(morph2To3, [0, 1], [0, -800]) +
    interpolate(morph3To4, [0, 1], [0, 150]);

  // Scales during focused screen sequences
  const bangScale = 1 + interpolate(morph1To2, [0, 1], [0, 0.4]) - interpolate(morph2To3, [0, 1], [0, 0.4]);
  const zhuScale = 1 + interpolate(morph2To3, [0, 1], [0, 0.4]) - interpolate(morph3To4, [0, 1], [0, 0.4]);

  // Screen state flags
  const isScreen1 = frame < screen1EndFrame;
  const isScreen2 = frame >= screen1EndFrame && frame < screen2EndFrame;
  const isScreen3 = frame >= screen2EndFrame && frame < screen3EndFrame;
  const isScreen4 = frame >= screen3EndFrame;

  // Header entrance spring
  const headerSpring = spring({ frame, fps, config: SPRING_OVERSHOOT });

  // ── CENTRALIZED ANIMATION TIMELINE SINGLE SOURCE OF TRUTH ──
  const anim = animationTimestamps || {
    screen1: {
      startFrame: 0,
      endFrame: screen1EndFrame,
      clothMention: { startFrame: 237, endFrame: 274 },
      wallMention: { startFrame: 328, endFrame: 379 },
      altarMention: { startFrame: 391, endFrame: 432 },
      muscleMention: { startFrame: 495, endFrame: 542 },
    },
    screen2: {
      startFrame: screen1EndFrame,
      endFrame: screen2EndFrame,
      topBang: { startFrame: screen1EndFrame, endFrame: 1094 },
      bottomJin: { startFrame: 1094, endFrame: 1656 },
      wholeBang: { startFrame: 1656, endFrame: screen2EndFrame },
    },
    screen3: {
      startFrame: screen2EndFrame,
      endFrame: screen3EndFrame,
      wholeZhuIntro: { startFrame: screen2EndFrame, endFrame: 2256 },
      leftQie: { startFrame: 2256, endFrame: 2568 },
      rightLi: { startFrame: 2568, endFrame: 3019 },
      wholeZhuOutro: { startFrame: 3019, endFrame: screen3EndFrame },
    },
    screen4: {
      startFrame: screen3EndFrame,
      endFrame: lessonDurationInFrames,
      bangHighlightEndFrame: 3634,
    },
  };

  // ── DYNAMIC RADICAL SPOTLIGHT & TIMING PHASES ──
  const isScreen2TopBang = isScreen2 && frame >= anim.screen2.topBang.startFrame && frame < anim.screen2.topBang.endFrame;
  const isScreen2BottomJin = isScreen2 && frame >= anim.screen2.bottomJin.startFrame && frame < anim.screen2.bottomJin.endFrame;
  const isScreen2WholeBang = isScreen2 && frame >= anim.screen2.wholeBang.startFrame;

  const isScreen3WholeZhuIntro = isScreen3 && frame >= anim.screen3.wholeZhuIntro.startFrame && frame < anim.screen3.wholeZhuIntro.endFrame;
  const isScreen3LeftQie = isScreen3 && frame >= anim.screen3.leftQie.startFrame && frame < anim.screen3.leftQie.endFrame;
  const isScreen3RightLi = isScreen3 && frame >= anim.screen3.rightLi.startFrame && frame < anim.screen3.rightLi.endFrame;
  const isScreen3WholeZhu = isScreen3 && frame >= anim.screen3.wholeZhuOutro.startFrame;

  const isScreen4BangHighlight = isScreen4 && frame < anim.screen4.bangHighlightEndFrame;
  const isScreen4ZhuHighlight = isScreen4 && frame >= anim.screen4.bangHighlightEndFrame;

  // ── SPOTLIGHT TARGET LOCAL COORDINATES INSIDE THE 600px HANZI CONTAINER ──
  let spot2Y = 210; // Top part 邦
  let spot2R = 120;
  if (isScreen2BottomJin) {
    spot2Y = 430; // Bottom part 巾
    spot2R = 120;
  } else if (isScreen2WholeBang) {
    spot2Y = 300; // Whole character 帮
    spot2R = 230;
  }

  let spot3X = 540; // Default whole character 助
  let spot3R = 230;
  if (isScreen3LeftQie) {
    spot3X = 390; // Left part 且
    spot3R = 120;
  } else if (isScreen3RightLi) {
    spot3X = 620; // Right part 力
    spot3R = 120;
  }

  // ── SCREEN 1 EMOJI ORBIT WITH BOUNCY SPRING ANIMATED SCALING ──
  const orbitBaseRadius = 400 + Math.sin(frame * 0.04) * 20;
  const orbitSpeed = frame * 0.01;

  const isMentionedCloth = isScreen1 && frame >= anim.screen1.clothMention.startFrame && frame <= anim.screen1.clothMention.endFrame;
  const isMentionedWall = isScreen1 && frame >= anim.screen1.wallMention.startFrame && frame <= anim.screen1.wallMention.endFrame;
  const isMentionedAltar = isScreen1 && frame >= anim.screen1.altarMention.startFrame && frame <= anim.screen1.altarMention.endFrame;
  const isMentionedMuscle = isScreen1 && frame >= anim.screen1.muscleMention.startFrame && frame <= anim.screen1.muscleMention.endFrame;

  const clothSpring = spring({ frame: Math.max(0, frame - anim.screen1.clothMention.startFrame), fps, config: SPRING_BOUNCE });
  const wallSpring = spring({ frame: Math.max(0, frame - anim.screen1.wallMention.startFrame), fps, config: SPRING_BOUNCE });
  const altarSpring = spring({ frame: Math.max(0, frame - anim.screen1.altarMention.startFrame), fps, config: SPRING_BOUNCE });
  const muscleSpring = spring({ frame: Math.max(0, frame - anim.screen1.muscleMention.startFrame), fps, config: SPRING_BOUNCE });

  const emojisData = [
    { emoji: '🏰', label: '邦 (Territory)', angleOffset: 0, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [1.0, 1.55]) : 1.0, active: isMentionedWall },
    { emoji: '🧵', label: '巾 (Cloth)', angleOffset: Math.PI / 2, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [1.0, 1.55]) : 1.0, active: isMentionedCloth },
    { emoji: '⛩️', label: '且 (Altar)', angleOffset: Math.PI, scale: isMentionedAltar ? interpolate(altarSpring, [0, 1], [1.0, 1.55]) : 1.0, active: isMentionedAltar },
    { emoji: '💪', label: '力 (Muscle)', angleOffset: (3 * Math.PI) / 2, scale: isMentionedMuscle ? interpolate(muscleSpring, [0, 1], [1.0, 1.55]) : 1.0, active: isMentionedMuscle },
  ];

  // Dynamic BGM Volume Easing (0.12 during lesson, fades out near end of lesson)
  const bgmFadeOut = interpolate(frame, [lessonDurationInFrames - 60, lessonDurationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bgmVolume = 0.12 * bgmFadeOut;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: 'Roboto, sans-serif', overflow: 'hidden' }}>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* MAIN ETYMOLOGY LESSON SEQUENCE */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={lessonDurationInFrames}>
        {/* CHINESE-STYLE SEAMLESS ORIENTAL CLOUD PATTERN BACKGROUND */}
        <ChineseBackground
          frame={frame}
          lessonTotalFrames={lessonDurationInFrames}
          morph1To2={morph1To2}
          morph2To3={morph2To3}
          morph3To4={morph3To4}
        />

        <AbsoluteFill style={{ padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
          {/* Ambient background floating particles */}
          <FloatingParticles count={14} color="#FF6F59" />

          {/* Top Brand Header in Finger Paint */}
          <div
            style={{
              marginTop: 50,
              backgroundColor: 'rgba(255, 111, 89, 0.14)',
              color: '#FF6F59',
              padding: '16px 44px',
              borderRadius: 999,
              fontSize: 34,
              fontWeight: 700,
              fontFamily: FONTS.display,
              letterSpacing: '0.04em',
              border: '2px solid rgba(255, 111, 89, 0.3)',
              transform: `scale(${headerSpring})`,
              boxShadow: '0 10px 30px rgba(255, 111, 89, 0.2)',
            }}
          >
            CHINESE CHARACTER ETYMOLOGY
          </div>

          {/* DYNAMIC DEDICATED SCREEN HEADINGS IN FINGER PAINT */}
          <div style={{ marginTop: 20, height: 100, textAlign: 'center' }}>
            {isScreen1 && (
              <h2 style={{ fontFamily: FONTS.display, fontSize: 50, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                Why Does <span style={{ color: '#FF6F59' }}>帮助</span> Contain Cloth & Muscle?
              </h2>
            )}
            {isScreen2 && (
              <h2 style={{ fontFamily: FONTS.display, fontSize: 52, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                Character 1: <span style={{ color: '#FF6F59' }}>帮 (bāng)</span> — Protective Backing
              </h2>
            )}
            {isScreen3 && (
              <h2 style={{ fontFamily: FONTS.display, fontSize: 52, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                Character 2: <span style={{ color: '#FF6F59' }}>助 (zhù)</span> — Muscle Power
              </h2>
            )}
            {isScreen4 && (
              <h2 style={{ fontFamily: FONTS.display, fontSize: 54, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                Synthesis: <span style={{ color: '#FF6F59' }}>帮助</span> = Protection + Muscle!
              </h2>
            )}
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* FLUID MORPHING INTACT HANZI CHARACTERS AREA */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 600,
              marginTop: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* INTACT PROPORTIONED CHARACTER '帮' (BANG) */}
            <div
              style={{
                position: 'absolute',
                transform: `translateX(${bangX}px) scale(${bangScale})`,
                fontSize: 340,
                fontWeight: 900,
                fontFamily: '"Noto Sans SC", sans-serif',
                color: isScreen4BangHighlight || isScreen2 ? '#FF6F59' : '#0F172A',
                textShadow: isScreen2 || isScreen4BangHighlight ? '0 16px 50px rgba(255, 111, 89, 0.45)' : '0 10px 30px rgba(15,23,42,0.1)',
                transition: 'color 0.25s ease, text-shadow 0.25s ease',
              }}
            >
              帮
            </div>

            {/* INTACT PROPORTIONED CHARACTER '助' (ZHU) */}
            <div
              style={{
                position: 'absolute',
                transform: `translateX(${zhuX}px) scale(${zhuScale})`,
                fontSize: 340,
                fontWeight: 900,
                fontFamily: '"Noto Sans SC", sans-serif',
                color: isScreen4ZhuHighlight || isScreen3 ? '#FF6F59' : '#0F172A',
                textShadow: isScreen3 || isScreen4ZhuHighlight ? '0 16px 50px rgba(255, 111, 89, 0.45)' : '0 10px 30px rgba(15,23,42,0.1)',
                transition: 'color 0.25s ease, text-shadow 0.25s ease',
              }}
            >
              助
            </div>

            {/* ── SCREEN 1 EMOJI ORBIT WITH ANIMATED BOUNCY SCALE POP-INS ── */}
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
                      fontSize: 88,
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

            {/* ── HIGH-CONTRAST BLACK DYNAMIC TARGET SPOTLIGHT ── */}
            {isScreen2 && <DynamicSmoothSpotlight x={540} y={spot2Y} radius={spot2R} frame={frame} />}
            {isScreen3 && <DynamicSmoothSpotlight x={spot3X} y={300} radius={spot3R} frame={frame} />}

            {/* SCREEN 4 SYNTHESIS AURA RING */}
            {isScreen4 && (
              <div
                style={{
                  position: 'absolute',
                  width: 660,
                  height: 440,
                  borderRadius: 48,
                  border: '4px solid #FF6F59',
                  backgroundColor: 'rgba(255, 111, 89, 0.1)',
                  boxShadow: '0 0 80px rgba(255, 111, 89, 0.45)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* 2-LINE DARK CARD TAGS WITH AUTHENTIC 3-FRAME FLIPBOOK CAT ANIMATIONS ACROSS ALL SCENES */}
          {/* ──────────────────────────────────────────────────────────── */}

          {/* SCENE 1 (INTRO): COMPOUND WORD 帮助 (3-FRAME FLIPBOOK LOOP) */}
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
            enterFrame={50}
            exitFrame={anim.screen1.endFrame}
          />

          {/* SCENE 2 (BANG FOCUS): RADICALS & WHOLE BANG (3-FRAME FLIPBOOK LOOPS) */}
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

          {/* SCENE 3 (ZHU FOCUS): RADICALS & WHOLE ZHU (3-FRAME FLIPBOOK LOOPS) */}
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

          {/* SCENE 4 (SYNTHESIS / CONCLUSION): COMPOUND WORD 帮助 (3-FRAME FLIPBOOK LOOP) */}
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

          {/* DYNAMIC REAL-TIME CAPTIONS */}
          {wordsAlignment && wordsAlignment.length > 0 && (
            <RealtimeCaptions words={wordsAlignment} positionBottom={200} />
          )}
        </AbsoluteFill>

        {/* VOICE OVER AUDIO */}
        {audioSrc && <Audio src={staticFile(audioSrc)} />}
      </Sequence>

      {/* ROYALTY-FREE CHINESE LOFI BACKGROUND MUSIC (Jade Tea Loop - 8% Volume across lesson & outro) */}
      {bgmAudioSrc && <Audio src={staticFile(bgmAudioSrc)} volume={0.08} loop />}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* REUSABLE KANSHU APP PROMOTIONAL OUTRO AT THE END */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Sequence from={lessonDurationInFrames} durationInFrames={outroDurationInFrames}>
        <KanshuAppOutro showAudio={true} audioSrc={outroAudioSrc} />
      </Sequence>
    </AbsoluteFill>
  );
};
