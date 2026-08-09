import React from 'react';
import { AbsoluteFill, Sequence, spring, interpolate, useCurrentFrame, useVideoConfig, Audio, staticFile } from 'remotion';
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
// CLEAN STEADY TARGET CIRCLE & POINTER ARROW (ZERO JITTER)
// ────────────────────────────────────────────────────────────

const SteadyRadicalSpotlight: React.FC<{
  x: number;
  y: number;
  radius?: number;
  frame: number;
}> = ({ x, y, radius = 125, frame }) => {
  const rotation = (frame * 2.0) % 360;

  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 60,
      }}
    >
      {/* PERFECT SYMMETRICAL CIRCLE (r=125px) — Smooth rotation, ZERO jitter */}
      <svg width={radius * 2 + 40} height={radius * 2 + 40} viewBox={`0 0 ${radius * 2 + 40} ${radius * 2 + 40}`} style={{ transform: `rotate(${rotation}deg)` }}>
        <circle
          cx={radius + 20}
          cy={radius + 20}
          r={radius}
          fill="none"
          stroke="#FF6F59"
          strokeWidth="6"
          strokeDasharray="18 14"
          filter="drop-shadow(0 4px 20px rgba(255, 111, 89, 0.65))"
        />
      </svg>

      {/* Steady Pointer Arrow 👇 — ZERO jitter */}
      <div
        style={{
          position: 'absolute',
          top: -85,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#FF6F59',
          fontSize: 72,
          fontWeight: 900,
          filter: 'drop-shadow(0 6px 16px rgba(255, 111, 89, 0.75))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span>👇</span>
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

  // ── DYNAMIC RADICAL SPOTLIGHT TIMINGS (Audio Timestamps) ──
  const isScreen2TopBang = isScreen2 && frame < 786;
  const isScreen2BottomJin = isScreen2 && frame >= 786;
  const isScreen3LeftQie = isScreen3 && frame < 1848;
  const isScreen3RightLi = isScreen3 && frame >= 1848;

  // Screen 4 Synthesis Highlights
  const isScreen4BangHighlight = isScreen4 && frame < 2600;
  const isScreen4ZhuHighlight = isScreen4 && frame >= 2600;

  // ── SCREEN 1 CONTINUOUS DYNAMIC EMOJI ORBIT WITH BREATHING RADIUS ──
  const orbitBaseRadius = 260 + Math.sin(frame * 0.08) * 30; // Pulsating breathing radius
  const orbitSpeed = frame * 0.025; // Smooth continuous 360-degree rotation

  // Detect when specific concepts are mentioned in Screen 1 for scale highlights
  const isMentionedCloth = isScreen1 && (currentTime >= 1.6 && currentTime <= 2.2);  // "cloth"
  const isMentionedWall = isScreen1 && (currentTime >= 2.2 && currentTime <= 2.7);   // "city wall"
  const isMentionedAltar = isScreen1 && (currentTime >= 2.7 && currentTime <= 3.2);  // "altar"
  const isMentionedMuscle = isScreen1 && (currentTime >= 3.2 && currentTime <= 3.8); // "muscle"

  const emojisData = [
    { emoji: '🏰', label: '邦 (Territory)', angleOffset: 0, isMentioned: isMentionedWall },
    { emoji: '🧵', label: '巾 (Cloth)', angleOffset: Math.PI / 2, isMentioned: isMentionedCloth },
    { emoji: '⛩️', label: '且 (Altar)', angleOffset: Math.PI, isMentioned: isMentionedAltar },
    { emoji: '💪', label: '力 (Muscle)', angleOffset: (3 * Math.PI) / 2, isMentioned: isMentionedMuscle },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONTS.pinyin, overflow: 'hidden' }}>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* MAIN ETYMOLOGY LESSON SEQUENCE */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={lessonDurationInFrames}>
        <AbsoluteFill style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Ambient background floating particles */}
          <FloatingParticles count={14} color="#FF6F59" />

          {/* Top Brand Header in Finger Paint (Latin Display Font) — 34px */}
          <div
            style={{
              marginTop: 65,
              backgroundColor: 'rgba(255, 111, 89, 0.14)',
              color: '#FF6F59',
              padding: '16px 44px',
              borderRadius: 999,
              fontSize: 34,
              fontWeight: 700,
              fontFamily: FONTS.display, // Finger Paint font for Latin display tags!
              letterSpacing: '0.04em',
              border: '2px solid rgba(255, 111, 89, 0.3)',
              transform: `scale(${headerSpring})`,
              boxShadow: '0 10px 30px rgba(255, 111, 89, 0.2)',
            }}
          >
            CHINESE CHARACTER ETYMOLOGY
          </div>

          {/* DYNAMIC DEDICATED SCREEN HEADINGS IN FINGER PAINT — 58px-64px */}
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
            {/* INTACT PROPORTIONED CHARACTER '帮' (BANG) — NOT DECOMPOSED STANDALONE TEXT! */}
            <div
              style={{
                position: 'absolute',
                transform: `translateX(${bangX}px) scale(${bangScale})`,
                fontSize: 270, // Intact, properly proportioned Hanzi!
                fontWeight: 900,
                fontFamily: '"Noto Sans SC", sans-serif', // Official Noto Sans SC font per user request!
                color: isScreen4BangHighlight || isScreen2 ? '#FF6F59' : '#0F172A',
                textShadow: isScreen2 || isScreen4BangHighlight ? '0 16px 50px rgba(255, 111, 89, 0.45)' : '0 10px 30px rgba(15,23,42,0.1)',
                transition: 'color 0.25s ease, text-shadow 0.25s ease',
              }}
            >
              帮
            </div>

            {/* INTACT PROPORTIONED CHARACTER '助' (ZHU) — NOT DECOMPOSED STANDALONE TEXT! */}
            <div
              style={{
                position: 'absolute',
                transform: `translateX(${zhuX}px) scale(${zhuScale})`,
                fontSize: 270, // Intact, properly proportioned Hanzi!
                fontWeight: 900,
                fontFamily: '"Noto Sans SC", sans-serif', // Official Noto Sans SC font per user request!
                color: isScreen4ZhuHighlight || isScreen3 ? '#FF6F59' : '#0F172A',
                textShadow: isScreen3 || isScreen4ZhuHighlight ? '0 16px 50px rgba(255, 111, 89, 0.45)' : '0 10px 30px rgba(15,23,42,0.1)',
                transition: 'color 0.25s ease, text-shadow 0.25s ease',
              }}
            >
              助
            </div>

            {/* ── SCREEN 1 DYNAMIC CONTINUOUS EMOJI ORBIT WITH BREATHING RADIUS ── */}
            {isScreen1 &&
              emojisData.map((item, i) => {
                const currentAngle = orbitSpeed + item.angleOffset;
                const emojiX = Math.cos(currentAngle) * orbitBaseRadius;
                const emojiY = Math.sin(currentAngle) * (orbitBaseRadius * 0.6); // Slightly elliptical 3D orbit perspective
                const scale = item.isMentioned ? 1.45 : 1.0;

                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      transform: `translate(${emojiX}px, ${emojiY}px) scale(${scale})`,
                      fontSize: 80,
                      filter: item.isMentioned ? 'drop-shadow(0 10px 24px rgba(255, 111, 89, 0.8))' : 'drop-shadow(0 6px 14px rgba(0,0,0,0.15))',
                      transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease',
                      zIndex: 30,
                    }}
                  >
                    {item.emoji}
                  </div>
                );
              })}

            {/* ── ENLARGED TARGET CIRCLES (r=125px) & STEADY POINTER ARROWS Directly OVER HANZI STROKES ── */}
            {/* Screen 2: Top '邦' part of intact '帮' */}
            {isScreen2TopBang && <SteadyRadicalSpotlight x={540} y={230} radius={125} frame={frame} />}

            {/* Screen 2: Bottom '巾' part of intact '帮' */}
            {isScreen2BottomJin && <SteadyRadicalSpotlight x={540} y={380} radius={120} frame={frame} />}

            {/* Screen 3: Left '且' part of intact '助' */}
            {isScreen3LeftQie && <SteadyRadicalSpotlight x={460} y={300} radius={120} frame={frame} />}

            {/* Screen 3: Right '力' part of intact '助' */}
            {isScreen3RightLi && <SteadyRadicalSpotlight x={620} y={300} radius={120} frame={frame} />}

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
