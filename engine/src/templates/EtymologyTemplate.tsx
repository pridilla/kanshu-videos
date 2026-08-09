import React from 'react';
import { AbsoluteFill, Sequence, spring, interpolate, useCurrentFrame, useVideoConfig, Audio, staticFile, Easing } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_GENTLE, SPRING_BOUNCE, SPRING_SMOOTH, FPS } from '../shared/constants';
import { FloatingParticles } from '../components/Icons';
import { KanshuAppOutro } from '../components/AppOutro';
import { RealtimeCaptions, AlignedWord } from '../components/RealtimeCaptions';

export interface RadicalInfo {
  radical: string;
  pinyin: string;
  meaning: string;
  role: 'semantic' | 'phonetic' | 'pictograph';
}

export interface ScreenTimestamps {
  screen1EndFrame: number;
  screen2EndFrame: number;
  screen3EndFrame: number;
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
  outroAudioSrc?: string;
  wordsAlignment?: AlignedWord[];
  screenTimestamps?: ScreenTimestamps;
  lessonDurationInFrames?: number;
  outroDurationInFrames?: number;
}

// ────────────────────────────────────────────────────────────
// HIGH-CONTRAST DEEP BLACK DYNAMICALLY-SCALING TARGET SPOTLIGHT
// ────────────────────────────────────────────────────────────

const DynamicSmoothSpotlight: React.FC<{
  x: number;
  y: number;
  radius?: number;
  frame: number;
}> = ({ x, y, radius = 125, frame }) => {
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
        transition: 'top 0.35s cubic-bezier(0.25, 1, 0.5, 1), left 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
    >
      {/* HIGH-CONTRAST DEEP BLACK DASHED CIRCLE — Smoothly resizes via SVG viewBox & stroke */}
      <svg
        width={radius * 2 + 40}
        height={radius * 2 + 40}
        viewBox={`0 0 ${radius * 2 + 40} ${radius * 2 + 40}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: 'width 0.35s ease, height 0.35s ease',
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
        />
      </svg>

      {/* Pointer Arrow 👇 */}
      <div
        style={{
          position: 'absolute',
          top: -(radius + 15),
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#FF6F59',
          fontSize: 72,
          fontWeight: 900,
          filter: 'drop-shadow(0 6px 16px rgba(255, 111, 89, 0.85))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'top 0.35s ease',
        }}
      >
        <span>👇</span>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// QUADRATIC SIDE SLIDING RADICAL INFO TAG
// ────────────────────────────────────────────────────────────

const QuadraticSideTag: React.FC<{
  emoji: string;
  radical: string;
  pinyin: string;
  translation: string;
  isVisible: boolean;
  frame: number;
  triggerFrame: number;
}> = ({ emoji, radical, pinyin, translation, isVisible, frame, triggerFrame }) => {
  const { fps } = useVideoConfig();

  const anim = spring({
    frame: Math.max(0, frame - triggerFrame),
    fps,
    config: { damping: 18, mass: 0.8, stiffness: 120 },
  });

  // Quadratic slide in/out easing
  const translateX = isVisible
    ? interpolate(anim, [0, 1], [-450, 40], { easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
    : -450;

  if (!isVisible && anim >= 1) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 230,
        left: 0,
        transform: `translateX(${translateX}px)`,
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '16px 28px',
        borderRadius: '0 24px 24px 0',
        border: '3px solid #FF6F59',
        borderLeft: 'none',
        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        zIndex: 90,
      }}
    >
      <span style={{ fontSize: 44 }}>{emoji}</span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 36, fontWeight: 900, color: '#FF6F59' }}>
            {radical}
          </span>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 26, fontWeight: 700, color: '#94A3B8', fontStyle: 'italic' }}>
            {pinyin}
          </span>
        </div>
        <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 24, fontWeight: 600, color: '#E2E8F0', marginTop: 2 }}>
          {translation}
        </span>
      </div>
    </div>
  );
};

export const EtymologyTemplate: React.FC<EtymologyConfig> = ({
  character = '帮助',
  pinyin = 'bāng zhù',
  meaning = 'To Help / Assistance',
  audioSrc = 'bangzhu_voice.mp3',
  outroAudioSrc = 'kanshu_outro_elevenlabs.mp3',
  wordsAlignment = [],
  screenTimestamps = {
    screen1EndFrame: 414,
    screen2EndFrame: 1507,
    screen3EndFrame: 2458,
    lessonTotalFrames: 2772,
  },
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

  // ── DYNAMIC RADICAL SPOTLIGHT & TIMING PHASES (Audio Timestamps) ──
  // Screen 2 Breakdown:
  // - Top '邦': 7.9s (474f) to 13.1s (786f)
  // - Bottom '巾': 13.1s (786f) to 18.6s (1120f)
  // - Whole Character '帮': 18.6s (1120f) to 25.1s (1507f) -> CIRCLE EXPANDS TO 210px!
  const isScreen2TopBang = isScreen2 && frame >= 474 && frame < 786;
  const isScreen2BottomJin = isScreen2 && frame >= 786 && frame < 1120;
  const isScreen2WholeBang = isScreen2 && frame >= 1120;

  // Screen 3 Breakdown:
  // - Left '且': 25.9s (1554f) to 30.8s (1848f)
  // - Right '力': 30.8s (1848f) to 35.8s (2150f)
  // - Whole Character '助': 35.8s (2150f) to 40.9s (2458f) -> CIRCLE EXPANDS TO 210px!
  const isScreen3LeftQie = isScreen3 && frame >= 1554 && frame < 1848;
  const isScreen3RightLi = isScreen3 && frame >= 1848 && frame < 2150;
  const isScreen3WholeZhu = isScreen3 && frame >= 2150;

  // Screen 4 Synthesis Highlights
  const isScreen4BangHighlight = isScreen4 && frame < 2600;
  const isScreen4ZhuHighlight = isScreen4 && frame >= 2600;

  // ── SPOTLIGHT TARGET POSITION & RADIUS ANIMATIONS ──
  // Screen 2 Target Y & Radius:
  // 邦 (top): y=200, r=110 | 巾 (bottom): y=360, r=110 | Whole 帮: y=280, r=210 (EXPANDED!)
  let spot2Y = 200;
  let spot2R = 110;
  if (isScreen2BottomJin) {
    spot2Y = 360;
    spot2R = 110;
  } else if (isScreen2WholeBang) {
    spot2Y = 280;
    spot2R = 210; // Expands to cover full character!
  }

  // Screen 3 Target X & Radius:
  // 且 (left): x=430, r=110 | 力 (right): x=590, r=110 | Whole 助: x=500, r=210 (EXPANDED!)
  let spot3X = 430;
  let spot3R = 110;
  if (isScreen3RightLi) {
    spot3X = 590;
    spot3R = 110;
  } else if (isScreen3WholeZhu) {
    spot3X = 500;
    spot3R = 210; // Expands to cover full character!
  }

  // ── SCREEN 1 EMOJI ORBIT WITH BOUNCY SPRING ANIMATED SCALING ──
  const orbitBaseRadius = 360 + Math.sin(frame * 0.04) * 20;
  const orbitSpeed = frame * 0.01;

  // Exact word boundary triggers from alignment.json
  const isMentionedCloth = isScreen1 && currentTime >= 3.45 && currentTime <= 3.85;
  const isMentionedWall = isScreen1 && currentTime >= 3.88 && currentTime <= 4.42;
  const isMentionedAltar = isScreen1 && currentTime >= 4.45 && currentTime <= 4.92;
  const isMentionedMuscle = isScreen1 && currentTime >= 4.95 && currentTime <= 5.90;

  // Smooth bouncy spring scales for emoji pop-ins
  const clothSpring = spring({ frame: Math.max(0, frame - 207), fps, config: SPRING_BOUNCE });
  const wallSpring = spring({ frame: Math.max(0, frame - 233), fps, config: SPRING_BOUNCE });
  const altarSpring = spring({ frame: Math.max(0, frame - 267), fps, config: SPRING_BOUNCE });
  const muscleSpring = spring({ frame: Math.max(0, frame - 297), fps, config: SPRING_BOUNCE });

  const emojisData = [
    { emoji: '🏰', label: '邦 (Territory)', angleOffset: 0, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [1.0, 1.55]) : 1.0, active: isMentionedWall },
    { emoji: '🧵', label: '巾 (Cloth)', angleOffset: Math.PI / 2, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [1.0, 1.55]) : 1.0, active: isMentionedCloth },
    { emoji: '⛩️', label: '且 (Altar)', angleOffset: Math.PI, scale: isMentionedAltar ? interpolate(altarSpring, [0, 1], [1.0, 1.55]) : 1.0, active: isMentionedAltar },
    { emoji: '💪', label: '力 (Muscle)', angleOffset: (3 * Math.PI) / 2, scale: isMentionedMuscle ? interpolate(muscleSpring, [0, 1], [1.0, 1.55]) : 1.0, active: isMentionedMuscle },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: 'Roboto, sans-serif', overflow: 'hidden' }}>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* MAIN ETYMOLOGY LESSON SEQUENCE */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={lessonDurationInFrames}>
        <AbsoluteFill style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Ambient background floating particles */}
          <FloatingParticles count={14} color="#FF6F59" />

          {/* Top Brand Header in Finger Paint */}
          <div
            style={{
              marginTop: 65,
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
          <div style={{ marginTop: 30, height: 120, textAlign: 'center' }}>
            {isScreen1 && (
              <h2 style={{ fontFamily: FONTS.display, fontSize: 56, color: '#0F172A', margin: 0, lineHeight: 1.25 }}>
                Why Does <span style={{ color: '#FF6F59' }}>帮助</span> Contain Cloth & Muscle?
              </h2>
            )}
            {isScreen2 && (
              <h2 style={{ fontFamily: FONTS.display, fontSize: 58, color: '#0F172A', margin: 0, lineHeight: 1.25 }}>
                Character 1: <span style={{ color: '#FF6F59' }}>帮 (bāng)</span> — Protective Backing
              </h2>
            )}
            {isScreen3 && (
              <h2 style={{ fontFamily: FONTS.display, fontSize: 58, color: '#0F172A', margin: 0, lineHeight: 1.25 }}>
                Character 2: <span style={{ color: '#FF6F59' }}>助 (zhù)</span> — Muscle Power
              </h2>
            )}
            {isScreen4 && (
              <h2 style={{ fontFamily: FONTS.display, fontSize: 60, color: '#0F172A', margin: 0, lineHeight: 1.25 }}>
                Synthesis: <span style={{ color: '#FF6F59' }}>帮助</span> = Protection + Muscle!
              </h2>
            )}
          </div>

          {/* ── QUADRATIC SIDE SLIDING RADICAL INFO TAGS ── */}
          <QuadraticSideTag emoji="🏰" radical="邦" pinyin="bāng" translation="Territory & Community" isVisible={isScreen2TopBang} frame={frame} triggerFrame={474} />
          <QuadraticSideTag emoji="🧵" radical="巾" pinyin="jīn" translation="Reinforcing Cloth Strip" isVisible={isScreen2BottomJin} frame={frame} triggerFrame={786} />
          <QuadraticSideTag emoji="🛡️" radical="帮" pinyin="bāng" translation="Protective Shoe Backing" isVisible={isScreen2WholeBang} frame={frame} triggerFrame={1120} />

          <QuadraticSideTag emoji="⛩️" radical="且" pinyin="zhǔ" translation="Heavy Altar Pedestal" isVisible={isScreen3LeftQie} frame={frame} triggerFrame={1554} />
          <QuadraticSideTag emoji="💪" radical="力" pinyin="lì" translation="Muscle Strength & Power" isVisible={isScreen3RightLi} frame={frame} triggerFrame={1848} />
          <QuadraticSideTag emoji="🏋️" radical="助" pinyin="zhù" translation="Lending Teamwork Muscle" isVisible={isScreen3WholeZhu} frame={frame} triggerFrame={2150} />

          {/* ──────────────────────────────────────────────────────────── */}
          {/* FLUID MORPHING INTACT HANZI CHARACTERS AREA (CENTRAL FOCUS) */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 600,
              marginTop: 40,
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
                fontSize: 270,
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
                fontSize: 270,
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
                      fontSize: 84,
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

            {/* ── HIGH-CONTRAST BLACK DYNAMIC TARGET SPOTLIGHT (Expands to r=210px for full character!) ── */}
            {isScreen2 && <DynamicSmoothSpotlight x={500} y={spot2Y} radius={spot2R} frame={frame} />}
            {isScreen3 && <DynamicSmoothSpotlight x={spot3X} y={280} radius={spot3R} frame={frame} />}

            {/* SCREEN 4 SYNTHESIS AURA RING */}
            {isScreen4 && (
              <div
                style={{
                  position: 'absolute',
                  width: 580,
                  height: 380,
                  borderRadius: 48,
                  border: '4px solid #FF6F59',
                  backgroundColor: 'rgba(255, 111, 89, 0.1)',
                  boxShadow: '0 0 80px rgba(255, 111, 89, 0.45)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>

          {/* DYNAMIC REAL-TIME CAPTIONS (SCALED UP TO 46px FOR MAXIMUM READABILITY) */}
          {wordsAlignment && wordsAlignment.length > 0 && (
            <RealtimeCaptions words={wordsAlignment} positionBottom={130} />
          )}
        </AbsoluteFill>

        {audioSrc && <Audio src={staticFile(audioSrc)} />}
      </Sequence>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* REUSABLE KANSHU APP PROMOTIONAL OUTRO AT THE END */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Sequence from={lessonDurationInFrames} durationInFrames={outroDurationInFrames}>
        <KanshuAppOutro showAudio={true} audioSrc={outroAudioSrc} />
      </Sequence>
    </AbsoluteFill>
  );
};
