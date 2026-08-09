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
// PERFECT SYMMETRICAL SPINNING TARGET CIRCLE & JITTERING ARROW
// ────────────────────────────────────────────────────────────

const DynamicRadicalSpotlight: React.FC<{
  x: number;
  y: number;
  radius?: number;
  frame: number;
}> = ({ x, y, radius = 75, frame }) => {
  // Hand-drawn organic jitter for continuous high retention motion
  const jitterX = Math.sin(frame * 0.35) * 5;
  const jitterY = Math.cos(frame * 0.25) * 5;
  const rotation = (frame * 3.0) % 360;

  return (
    <div
      style={{
        position: 'absolute',
        top: y + jitterY,
        left: x + jitterX,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 60,
      }}
    >
      {/* PERFECT SYMMETRICAL CIRCLE — Spins smoothly with ZERO wobbling distortion! */}
      <svg width={radius * 2 + 40} height={radius * 2 + 40} viewBox={`0 0 ${radius * 2 + 40} ${radius * 2 + 40}`} style={{ transform: `rotate(${rotation}deg)` }}>
        <circle
          cx={radius + 20}
          cy={radius + 20}
          r={radius}
          fill="none"
          stroke="#FF6F59"
          strokeWidth="6"
          strokeDasharray="16 12"
          filter="drop-shadow(0 4px 16px rgba(255, 111, 89, 0.6))"
        />
      </svg>

      {/* Dynamic Jittering Pointer Arrow pointing directly to Radical */}
      <div
        style={{
          position: 'absolute',
          top: -65,
          left: '50%',
          transform: `translateX(-50%) translateY(${Math.sin(frame * 0.4) * 8}px)`,
          color: '#FF6F59',
          fontSize: 60,
          fontWeight: 900,
          filter: 'drop-shadow(0 6px 16px rgba(255, 111, 89, 0.7))',
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

  // Calculate dynamic X position for character '帮' (Bang)
  const bangX =
    interpolate(morph1To2, [0, 1], [-140, 0]) +
    interpolate(morph2To3, [0, 1], [0, -750]) +
    interpolate(morph3To4, [0, 1], [0, 610]);

  // Calculate dynamic X position for character '助' (Zhu)
  const zhuX =
    interpolate(morph1To2, [0, 1], [140, 750]) +
    interpolate(morph2To3, [0, 1], [0, -750]) +
    interpolate(morph3To4, [0, 1], [0, 140]);

  // Scale of '帮' & '助'
  const bangScale = 1 + interpolate(morph1To2, [0, 1], [0, 0.35]) - interpolate(morph2To3, [0, 1], [0, 0.35]);
  const zhuScale = 1 + interpolate(morph2To3, [0, 1], [0, 0.35]) - interpolate(morph3To4, [0, 1], [0, 0.35]);

  // Screen state flags
  const isScreen1 = frame < screen1EndFrame;
  const isScreen2 = frame >= screen1EndFrame && frame < screen2EndFrame;
  const isScreen3 = frame >= screen2EndFrame && frame < screen3EndFrame;
  const isScreen4 = frame >= screen3EndFrame;

  // Header entrance spring
  const headerSpring = spring({ frame, fps, config: SPRING_OVERSHOOT });

  // ── DYNAMIC RADICAL SPOTLIGHT & WEIGHT HIGHLIGHT TIMINGS (Audio Timestamps) ──
  // Screen 2 (帮): Audio speaks "The top part is 邦" around 7.9s (474f), "The bottom part is 巾" around 13.1s (786f)
  const isScreen2TopBang = isScreen2 && frame < 786;
  const isScreen2BottomJin = isScreen2 && frame >= 786;

  // Screen 3 (助): Audio speaks "The left part is 且" around 25.9s (1554f), "The right part is 力" around 30.8s (1848f)
  const isScreen3LeftQie = isScreen3 && frame < 1848;
  const isScreen3RightLi = isScreen3 && frame >= 1848;

  // Screen 4 (Synthesis): Audio speaks "帮 is the protective backing..." (2458f-2600f), "...and 助 is the muscle power!" (2600f+)
  const isScreen4BangHighlight = isScreen4 && frame < 2600;
  const isScreen4ZhuHighlight = isScreen4 && frame >= 2600;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONTS.pinyin, overflow: 'hidden' }}>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* MAIN ETYMOLOGY LESSON SEQUENCE */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={lessonDurationInFrames}>
        <AbsoluteFill style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Warm background floating particles */}
          <FloatingParticles count={14} color="#FF6F59" />

          {/* Top Brand Header in Finger Paint (Latin Display Font) */}
          <div
            style={{
              marginTop: 70,
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
          <div style={{ marginTop: 32, height: 110, textAlign: 'center' }}>
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
          {/* FLUID MORPHING HANZI CHARACTERS AREA (CENTRAL FOCUS) */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 520,
              marginTop: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* ── CHARACTER '帮' (BANG) — WITH DYNAMIC RADICAL WEIGHT HIGHLIGHTING ── */}
            <div
              style={{
                position: 'absolute',
                transform: `translateX(${bangX}px) scale(${bangScale})`,
                fontFamily: '"Noto Sans SC", sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                lineHeight: 0.9,
              }}
            >
              {isScreen2 ? (
                // Decomposed '帮' into Top '邦' and Bottom '巾' for dynamic weight/color highlight!
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 230 }}>
                  <span
                    style={{
                      color: isScreen2TopBang ? '#FF6F59' : '#64748B',
                      fontWeight: isScreen2TopBang ? 900 : 400,
                      opacity: isScreen2TopBang ? 1.0 : 0.4,
                      transform: isScreen2TopBang ? 'scale(1.12)' : 'scale(1)',
                      transition: 'all 0.25s ease',
                      textShadow: isScreen2TopBang ? '0 8px 24px rgba(255, 111, 89, 0.5)' : 'none',
                    }}
                  >
                    邦
                  </span>
                  <span
                    style={{
                      color: isScreen2BottomJin ? '#FF6F59' : '#64748B',
                      fontWeight: isScreen2BottomJin ? 900 : 400,
                      opacity: isScreen2BottomJin ? 1.0 : 0.4,
                      transform: isScreen2BottomJin ? 'scale(1.12)' : 'scale(1)',
                      marginTop: -30,
                      transition: 'all 0.25s ease',
                      textShadow: isScreen2BottomJin ? '0 8px 24px rgba(255, 111, 89, 0.5)' : 'none',
                    }}
                  >
                    巾
                  </span>
                </div>
              ) : (
                <span
                  style={{
                    fontSize: 230,
                    fontWeight: 900,
                    color: isScreen4BangHighlight ? '#FF6F59' : '#0F172A',
                    transform: isScreen4BangHighlight ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.25s ease',
                    textShadow: isScreen4BangHighlight ? '0 12px 30px rgba(255, 111, 89, 0.6)' : '0 10px 30px rgba(15,23,42,0.1)',
                  }}
                >
                  帮
                </span>
              )}
            </div>

            {/* ── CHARACTER '助' (ZHU) — WITH DYNAMIC RADICAL WEIGHT HIGHLIGHTING ── */}
            <div
              style={{
                position: 'absolute',
                transform: `translateX(${zhuX}px) scale(${zhuScale})`,
                fontFamily: '"Noto Sans SC", sans-serif',
                display: 'flex',
                alignItems: 'center',
                lineHeight: 0.9,
              }}
            >
              {isScreen3 ? (
                // Decomposed '助' into Left '且' and Right '力' for dynamic weight/color highlight!
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 230 }}>
                  <span
                    style={{
                      color: isScreen3LeftQie ? '#FF6F59' : '#64748B',
                      fontWeight: isScreen3LeftQie ? 900 : 400,
                      opacity: isScreen3LeftQie ? 1.0 : 0.4,
                      transform: isScreen3LeftQie ? 'scale(1.12)' : 'scale(1)',
                      transition: 'all 0.25s ease',
                      textShadow: isScreen3LeftQie ? '0 8px 24px rgba(255, 111, 89, 0.5)' : 'none',
                    }}
                  >
                    且
                  </span>
                  <span
                    style={{
                      color: isScreen3RightLi ? '#FF6F59' : '#64748B',
                      fontWeight: isScreen3RightLi ? 900 : 400,
                      opacity: isScreen3RightLi ? 1.0 : 0.4,
                      transform: isScreen3RightLi ? 'scale(1.12)' : 'scale(1)',
                      marginLeft: -10,
                      transition: 'all 0.25s ease',
                      textShadow: isScreen3RightLi ? '0 8px 24px rgba(255, 111, 89, 0.5)' : 'none',
                    }}
                  >
                    力
                  </span>
                </div>
              ) : (
                <span
                  style={{
                    fontSize: 230,
                    fontWeight: 900,
                    color: isScreen4ZhuHighlight ? '#FF6F59' : '#0F172A',
                    transform: isScreen4ZhuHighlight ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.25s ease',
                    textShadow: isScreen4ZhuHighlight ? '0 12px 30px rgba(255, 111, 89, 0.6)' : '0 10px 30px rgba(15,23,42,0.1)',
                  }}
                >
                  助
                </span>
              )}
            </div>

            {/* SCREEN 1 EMOJI ORBITS (Overview 🏰 🧵 ⛩️ 💪) */}
            {isScreen1 && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: 20, left: 140, fontSize: 72 }}>🏰</div>
                <div style={{ position: 'absolute', bottom: 30, left: 160, fontSize: 72 }}>🧵</div>
                <div style={{ position: 'absolute', top: 20, right: 140, fontSize: 72 }}>⛩️</div>
                <div style={{ position: 'absolute', bottom: 30, right: 160, fontSize: 72 }}>💪</div>
              </div>
            )}

            {/* SCREEN 2 EMOJI ORBITS & RADICAL BADGES (Focus on 帮) */}
            {isScreen2 && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '0' }}>
                {/* Top Radical: 邦 (Territory/Community) */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    padding: '16px 36px',
                    boxShadow: isScreen2TopBang ? '0 16px 40px rgba(255, 111, 89, 0.4)' : '0 12px 32px rgba(15,23,42,0.12)',
                    border: isScreen2TopBang ? '3px solid #FF6F59' : '2px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    transform: isScreen2TopBang ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: 56 }}>🏰</span>
                  <div>
                    <span style={{ fontFamily: FONTS.display, fontSize: 36, color: '#FF6F59', fontWeight: 700 }}>
                      邦 (bāng)
                    </span>
                    <span style={{ fontSize: 26, color: '#334155', fontWeight: 700, marginLeft: 16 }}>
                      Territory & Community
                    </span>
                  </div>
                </div>

                {/* Bottom Radical: 巾 (Cloth/Towel Strip) */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    padding: '16px 36px',
                    boxShadow: isScreen2BottomJin ? '0 16px 40px rgba(255, 111, 89, 0.4)' : '0 12px 32px rgba(15,23,42,0.12)',
                    border: isScreen2BottomJin ? '3px solid #FF6F59' : '2px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    transform: isScreen2BottomJin ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: 56 }}>🧵</span>
                  <div>
                    <span style={{ fontFamily: FONTS.display, fontSize: 36, color: '#FF6F59', fontWeight: 700 }}>
                      巾 (jīn)
                    </span>
                    <span style={{ fontSize: 26, color: '#334155', fontWeight: 700, marginLeft: 16 }}>
                      Reinforcing Cloth Strip
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3 EMOJI ORBITS & RADICAL BADGES (Focus on 助) */}
            {isScreen3 && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '0' }}>
                {/* Top Radical: 且 (Altar Pedestal) */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    padding: '16px 36px',
                    boxShadow: isScreen3LeftQie ? '0 16px 40px rgba(255, 111, 89, 0.4)' : '0 12px 32px rgba(15,23,42,0.12)',
                    border: isScreen3LeftQie ? '3px solid #FF6F59' : '2px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    transform: isScreen3LeftQie ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: 56 }}>⛩️</span>
                  <div>
                    <span style={{ fontFamily: FONTS.display, fontSize: 36, color: '#FF6F59', fontWeight: 700 }}>
                      且 (zhǔ)
                    </span>
                    <span style={{ fontSize: 26, color: '#334155', fontWeight: 700, marginLeft: 16 }}>
                      Heavy Altar Pedestal
                    </span>
                  </div>
                </div>

                {/* Bottom Radical: 力 (Muscle Strength) */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    padding: '16px 36px',
                    boxShadow: isScreen3RightLi ? '0 16px 40px rgba(255, 111, 89, 0.4)' : '0 12px 32px rgba(15,23,42,0.12)',
                    border: isScreen3RightLi ? '3px solid #FF6F59' : '2px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    transform: isScreen3RightLi ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: 56 }}>💪</span>
                  <div>
                    <span style={{ fontFamily: FONTS.display, fontSize: 36, color: '#FF6F59', fontWeight: 700 }}>
                      力 (lì)
                    </span>
                    <span style={{ fontSize: 26, color: '#334155', fontWeight: 700, marginLeft: 16 }}>
                      Muscle Power & Labor
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── PERFECT SYMMETRICAL CIRCLE & ARROW SPOTLIGHT Directly ON HANZI RADICAL STROKES ── */}
            {isScreen2TopBang && <DynamicRadicalSpotlight x={500} y={200} radius={65} frame={frame} />}
            {isScreen2BottomJin && <DynamicRadicalSpotlight x={500} y={310} radius={65} frame={frame} />}
            {isScreen3LeftQie && <DynamicRadicalSpotlight x={430} y={260} radius={65} frame={frame} />}
            {isScreen3RightLi && <DynamicRadicalSpotlight x={570} y={260} radius={65} frame={frame} />}

            {/* SCREEN 4 SYNTHESIS AURA RING */}
            {isScreen4 && (
              <div
                style={{
                  position: 'absolute',
                  width: 520,
                  height: 340,
                  borderRadius: 44,
                  border: '4px solid #FF6F59',
                  backgroundColor: 'rgba(255, 111, 89, 0.1)',
                  boxShadow: '0 0 70px rgba(255, 111, 89, 0.45)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* DYNAMIC SCREEN EXPLANATION CARD IN FINGER PAINT */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div
            style={{
              marginTop: 45,
              width: '95%',
              backgroundColor: '#FFFFFF',
              borderRadius: 32,
              padding: '28px 44px',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
              border: '2px solid rgba(255, 111, 89, 0.35)',
              textAlign: 'center',
            }}
          >
            {isScreen1 && (
              <div>
                <div style={{ fontFamily: FONTS.display, fontSize: 28, color: '#FF6F59', textTransform: 'uppercase', marginBottom: 8 }}>
                  💡 ETYMOLOGY SECRET
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', lineHeight: 1.4 }}>
                  Every radical tells the story of how support is given!
                </div>
              </div>
            )}
            {isScreen2 && (
              <div>
                <div style={{ fontFamily: FONTS.display, fontSize: 28, color: '#FF6F59', textTransform: 'uppercase', marginBottom: 8 }}>
                  🛡️ ANCIENT COBBLER METAPHOR
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', lineHeight: 1.4 }}>
                  "Cloth strips (巾) reinforced shoe borders (邦) from tearing. 帮 = Protective Backing!"
                </div>
              </div>
            )}
            {isScreen3 && (
              <div>
                <div style={{ fontFamily: FONTS.display, fontSize: 28, color: '#FF6F59', textTransform: 'uppercase', marginBottom: 8 }}>
                  🏋️ TEAMWORK LABOUR METAPHOR
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', lineHeight: 1.4 }}>
                  "Lifting a heavy stone altar (且) required muscle power (力). 助 = Lending Strength!"
                </div>
              </div>
            )}
            {isScreen4 && (
              <div>
                <div style={{ fontFamily: FONTS.display, fontSize: 30, color: '#FF6F59', textTransform: 'uppercase', marginBottom: 8 }}>
                  ✨ FULL ASSISTANCE & SUPPORT
                </div>
                <div style={{ fontSize: 38, fontWeight: 900, color: '#0F172A', lineHeight: 1.4 }}>
                  "帮 (Backing) + 助 (Muscle) = Complete Support & Assistance!"
                </div>
              </div>
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
