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
  // Transition 1 -> 2 (around screen1EndFrame)
  const morph1To2 = spring({
    frame: Math.max(0, frame - screen1EndFrame),
    fps,
    config: SPRING_SMOOTH,
  });

  // Transition 2 -> 3 (around screen2EndFrame)
  const morph2To3 = spring({
    frame: Math.max(0, frame - screen2EndFrame),
    fps,
    config: SPRING_SMOOTH,
  });

  // Transition 3 -> 4 (around screen3EndFrame)
  const morph3To4 = spring({
    frame: Math.max(0, frame - screen3EndFrame),
    fps,
    config: SPRING_SMOOTH,
  });

  // Calculate dynamic X position for character '帮' (Bang)
  // Screen 1: x = -130px | Screen 2: x = 0px (Center) | Screen 3: x = -700px (Off-screen) | Screen 4: x = -130px
  const bangX =
    interpolate(morph1To2, [0, 1], [-130, 0]) +
    interpolate(morph2To3, [0, 1], [0, -700]) +
    interpolate(morph3To4, [0, 1], [0, 570]);

  // Calculate dynamic X position for character '助' (Zhu)
  // Screen 1: x = +130px | Screen 2: x = +700px (Off-screen) | Screen 3: x = 0px (Center) | Screen 4: x = +130px
  const zhuX =
    interpolate(morph1To2, [0, 1], [130, 700]) +
    interpolate(morph2To3, [0, 1], [0, -700]) +
    interpolate(morph3To4, [0, 1], [0, 130]);

  // Scale of '帮' (Scales up during Screen 2 focus)
  const bangScale = 1 + interpolate(morph1To2, [0, 1], [0, 0.35]) - interpolate(morph2To3, [0, 1], [0, 0.35]);

  // Scale of '助' (Scales up during Screen 3 focus)
  const zhuScale = 1 + interpolate(morph2To3, [0, 1], [0, 0.35]) - interpolate(morph3To4, [0, 1], [0, 0.35]);

  // Current active screen index for overlay titles
  const isScreen1 = frame < screen1EndFrame;
  const isScreen2 = frame >= screen1EndFrame && frame < screen2EndFrame;
  const isScreen3 = frame >= screen2EndFrame && frame < screen3EndFrame;
  const isScreen4 = frame >= screen3EndFrame;

  // Header entrance spring
  const headerSpring = spring({ frame, fps, config: SPRING_OVERSHOOT });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONTS.pinyin, overflow: 'hidden' }}>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* MAIN ETYMOLOGY LESSON SEQUENCE */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={lessonDurationInFrames}>
        <AbsoluteFill style={{ padding: 60, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Warm background floating particles */}
          <FloatingParticles count={12} color="#FF6F59" />

          {/* Top Brand Header in Finger Paint (Latin Display Font) */}
          <div
            style={{
              marginTop: 90,
              backgroundColor: 'rgba(255, 111, 89, 0.12)',
              color: '#FF6F59',
              padding: '12px 32px',
              borderRadius: 999,
              fontSize: 26,
              fontWeight: 700,
              fontFamily: FONTS.display, // Finger Paint font for Latin display tags!
              letterSpacing: '0.04em',
              border: '1.5px solid rgba(255, 111, 89, 0.25)',
              transform: `scale(${headerSpring})`,
              boxShadow: '0 8px 24px rgba(255, 111, 89, 0.15)',
            }}
          >
            CHINESE CHARACTER ETYMOLOGY
          </div>

          {/* DYNAMIC DEDICATED SCREEN HEADINGS IN FINGER PAINT */}
          <div style={{ marginTop: 36, height: 70, textAlign: 'center' }}>
            {isScreen1 && (
              <h2
                style={{
                  fontFamily: FONTS.display, // Finger Paint font
                  fontSize: 42,
                  color: '#0F172A',
                  margin: 0,
                }}
              >
                Why Does <span style={{ color: '#FF6F59' }}>帮助</span> Contain Cloth & Muscle?
              </h2>
            )}
            {isScreen2 && (
              <h2
                style={{
                  fontFamily: FONTS.display, // Finger Paint font
                  fontSize: 44,
                  color: '#0F172A',
                  margin: 0,
                }}
              >
                Character 1: <span style={{ color: '#FF6F59' }}>帮 (bāng)</span> — Protective Backing
              </h2>
            )}
            {isScreen3 && (
              <h2
                style={{
                  fontFamily: FONTS.display, // Finger Paint font
                  fontSize: 44,
                  color: '#0F172A',
                  margin: 0,
                }}
              >
                Character 2: <span style={{ color: '#FF6F59' }}>助 (zhù)</span> — Muscle Power
              </h2>
            )}
            {isScreen4 && (
              <h2
                style={{
                  fontFamily: FONTS.display, // Finger Paint font
                  fontSize: 46,
                  color: '#0F172A',
                  margin: 0,
                }}
              >
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
              marginTop: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Character '帮' (Bang) — Morphing Position & Scale */}
            <div
              style={{
                position: 'absolute',
                transform: `translateX(${bangX}px) scale(${bangScale})`,
                fontSize: 220,
                fontWeight: 900,
                fontFamily: '"ZCOOL KuaiLe", "Noto Serif SC", serif', // Official Chinese brand font
                color: '#0F172A',
                textShadow: isScreen2 ? '0 16px 40px rgba(255, 111, 89, 0.35)' : '0 10px 30px rgba(15,23,42,0.1)',
                transition: 'text-shadow 0.3s ease',
              }}
            >
              帮
            </div>

            {/* Character '助' (Zhu) — Morphing Position & Scale */}
            <div
              style={{
                position: 'absolute',
                transform: `translateX(${zhuX}px) scale(${zhuScale})`,
                fontSize: 220,
                fontWeight: 900,
                fontFamily: '"ZCOOL KuaiLe", "Noto Serif SC", serif', // Official Chinese brand font
                color: '#0F172A',
                textShadow: isScreen3 ? '0 16px 40px rgba(255, 111, 89, 0.35)' : '0 10px 30px rgba(15,23,42,0.1)',
                transition: 'text-shadow 0.3s ease',
              }}
            >
              助
            </div>

            {/* SCREEN 1 EMOJI ORBITS (Overview 🏰 🧵 ⛩️ 💪) */}
            {isScreen1 && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: 20, left: 160, fontSize: 64 }}>🏰</div>
                <div style={{ position: 'absolute', bottom: 40, left: 180, fontSize: 64 }}>🧵</div>
                <div style={{ position: 'absolute', top: 20, right: 160, fontSize: 64 }}>⛩️</div>
                <div style={{ position: 'absolute', bottom: 40, right: 180, fontSize: 64 }}>💪</div>
              </div>
            )}

            {/* SCREEN 2 EMOJI ORBITS & RADICAL BADGES (Focus on 帮) */}
            {isScreen2 && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                {/* Top Radical: 邦 (Territory/Community) */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: '12px 28px',
                    boxShadow: '0 12px 32px rgba(15,23,42,0.12)',
                    border: '2px solid #FF6F59',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 44 }}>🏰</span>
                  <div>
                    <span style={{ fontFamily: FONTS.display, fontSize: 26, color: '#FF6F59', fontWeight: 700 }}>
                      邦 (bāng)
                    </span>
                    <span style={{ fontSize: 20, color: '#475569', fontWeight: 600, marginLeft: 12 }}>
                      Territory & Community
                    </span>
                  </div>
                </div>

                {/* Bottom Radical: 巾 (Cloth/Towel Strip) */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: '12px 28px',
                    boxShadow: '0 12px 32px rgba(15,23,42,0.12)',
                    border: '2px solid #FF6F59',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 44 }}>🧵</span>
                  <div>
                    <span style={{ fontFamily: FONTS.display, fontSize: 26, color: '#FF6F59', fontWeight: 700 }}>
                      巾 (jīn)
                    </span>
                    <span style={{ fontSize: 20, color: '#475569', fontWeight: 600, marginLeft: 12 }}>
                      Reinforcing Cloth Strip
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3 EMOJI ORBITS & RADICAL BADGES (Focus on 助) */}
            {isScreen3 && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                {/* Top Radical: 且 (Altar Pedestal) */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: '12px 28px',
                    boxShadow: '0 12px 32px rgba(15,23,42,0.12)',
                    border: '2px solid #FF6F59',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 44 }}>⛩️</span>
                  <div>
                    <span style={{ fontFamily: FONTS.display, fontSize: 26, color: '#FF6F59', fontWeight: 700 }}>
                      且 (zhǔ)
                    </span>
                    <span style={{ fontSize: 20, color: '#475569', fontWeight: 600, marginLeft: 12 }}>
                      Heavy Altar Pedestal
                    </span>
                  </div>
                </div>

                {/* Bottom Radical: 力 (Muscle Strength) */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: '12px 28px',
                    boxShadow: '0 12px 32px rgba(15,23,42,0.12)',
                    border: '2px solid #FF6F59',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 44 }}>💪</span>
                  <div>
                    <span style={{ fontFamily: FONTS.display, fontSize: 26, color: '#FF6F59', fontWeight: 700 }}>
                      力 (lì)
                    </span>
                    <span style={{ fontSize: 20, color: '#475569', fontWeight: 600, marginLeft: 12 }}>
                      Muscle Power & Labor
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 4 SYNTHESIS AURA RING */}
            {isScreen4 && (
              <div
                style={{
                  position: 'absolute',
                  width: 480,
                  height: 320,
                  borderRadius: 40,
                  border: '3px solid #FF6F59',
                  backgroundColor: 'rgba(255, 111, 89, 0.08)',
                  boxShadow: '0 0 60px rgba(255, 111, 89, 0.4)',
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
              marginTop: 40,
              width: '90%',
              backgroundColor: '#FFFFFF',
              borderRadius: 28,
              padding: '24px 36px',
              boxShadow: '0 16px 40px rgba(15, 23, 42, 0.1)',
              border: '1.5px solid rgba(255, 111, 89, 0.3)',
              textAlign: 'center',
            }}
          >
            {isScreen1 && (
              <div>
                <div style={{ fontFamily: FONTS.display, fontSize: 22, color: '#FF6F59', textTransform: 'uppercase', marginBottom: 6 }}>
                  💡 ETYMOLOGY SECRET
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', lineHeight: 1.4 }}>
                  Every radical tells the story of how support is given!
                </div>
              </div>
            )}
            {isScreen2 && (
              <div>
                <div style={{ fontFamily: FONTS.display, fontSize: 22, color: '#FF6F59', textTransform: 'uppercase', marginBottom: 6 }}>
                  🛡️ ANCIENT COBBLER METAPHOR
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', lineHeight: 1.4 }}>
                  "Cloth strips (巾) reinforced shoe borders (邦) from tearing. 帮 = Protective Backing!"
                </div>
              </div>
            )}
            {isScreen3 && (
              <div>
                <div style={{ fontFamily: FONTS.display, fontSize: 22, color: '#FF6F59', textTransform: 'uppercase', marginBottom: 6 }}>
                  🏋️ TEAMWORK LABOUR METAPHOR
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', lineHeight: 1.4 }}>
                  "Lifting a heavy stone altar (且) required muscle power (力). 助 = Lending Strength!"
                </div>
              </div>
            )}
            {isScreen4 && (
              <div>
                <div style={{ fontFamily: FONTS.display, fontSize: 24, color: '#FF6F59', textTransform: 'uppercase', marginBottom: 6 }}>
                  ✨ FULL ASSISTANCE & SUPPORT
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', lineHeight: 1.4 }}>
                  "帮 (Backing) + 助 (Muscle) = Complete Support & Assistance!"
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC REAL-TIME CAPTIONS WITH ACTIVE WORD HIGHLIGHT & ZERO JITTER */}
          {wordsAlignment && wordsAlignment.length > 0 && (
            <RealtimeCaptions words={wordsAlignment} positionBottom={120} />
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
