import React from 'react';
import { AbsoluteFill, Sequence, spring, interpolate, useCurrentFrame, useVideoConfig, Audio, staticFile } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_GENTLE, SPRING_BOUNCE, SPRING_SMOOTH, FPS } from '../shared/constants';
import { FloatingParticles } from '../components/Icons';
import { KanshuAppOutro } from '../components/AppOutro';

export interface RadicalInfo {
  radical: string;
  pinyin: string;
  meaning: string;
  role: 'semantic' | 'phonetic' | 'pictograph';
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
  lessonDurationInFrames?: number;
  outroDurationInFrames?: number;
}

export const EtymologyTemplate: React.FC<EtymologyConfig> = ({
  character = '休',
  pinyin = 'xiū',
  tone = 1,
  meaning = 'To Rest',
  oracleBoneSymbol = '🧍🌳',
  radicals = [
    { radical: '亻', pinyin: 'rén', meaning: 'person / human', role: 'semantic' },
    { radical: '木', pinyin: 'mù', meaning: 'tree / wood', role: 'semantic' },
  ],
  story = 'A human (亻) leaning against a tree (木) to take a rest.',
  exampleSentence = {
    cn: '工作累了，就休息一下吧。',
    pinyin: 'Gōngzuò lèi le, jiù xiūxi yíxià ba.',
    en: "When you're tired from work, take a rest.",
    highlightWord: '休息',
  },
  audioSrc,
  outroAudioSrc = 'kanshu_outro_voice.mp3',
  lessonDurationInFrames = 1200, // 20s
  outroDurationInFrames = 400,    // 6.6s
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── LESSON SCENE ANIMATIONS ──
  // Entrance spring for main character (0-400 frames)
  const charSpring = spring({ frame, fps, config: SPRING_BOUNCE });
  
  // Oracle bone evolution morph (250-600 frames)
  const morphProgress = spring({ frame: Math.max(0, frame - 200), fps, config: SPRING_SMOOTH });

  // Radical breakdown entrance (550-900 frames)
  const radicalSpring = spring({ frame: Math.max(0, frame - 500), fps, config: SPRING_GENTLE });

  // Example sentence entrance (850-1200 frames)
  const sentenceSpring = spring({ frame: Math.max(0, frame - 800), fps, config: SPRING_OVERSHOOT });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONTS.pinyin, overflow: 'hidden' }}>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* MAIN ETYOLOGY LESSON SEQUENCE */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={lessonDurationInFrames}>
        <AbsoluteFill style={{ padding: 60, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FloatingParticles count={10} color="#FF6F59" />

          {/* Header Tag */}
          <div
            style={{
              marginTop: 100,
              backgroundColor: 'rgba(255, 111, 89, 0.12)',
              color: '#FF6F59',
              padding: '10px 28px',
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              border: '1.5px solid rgba(255, 111, 89, 0.25)',
            }}
          >
            Chinese Character Etymology
          </div>

          {/* Character & Oracle Bone Evolution Display */}
          <div
            style={{
              marginTop: 60,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: `scale(${charSpring})`,
            }}
          >
            {/* Oracle Bone Origin */}
            <div
              style={{
                fontSize: 72,
                opacity: interpolate(morphProgress, [0, 1], [1, 0.6]),
                transform: `translateY(${interpolate(morphProgress, [0, 1], [0, -20])}px)`,
                marginBottom: 10,
              }}
            >
              {oracleBoneSymbol}
            </div>

            {/* Main Modern Hanzi Character */}
            <div
              style={{
                fontSize: 180,
                fontWeight: 900,
                fontFamily: '"Noto Serif SC", serif',
                color: '#0F172A',
                lineHeight: 1,
                textShadow: '0 10px 30px rgba(15,23,42,0.1)',
              }}
            >
              {character}
            </div>

            {/* Pinyin & Meaning Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
              <span style={{ fontSize: 44, fontWeight: 800, color: '#FF6F59' }}>{pinyin}</span>
              <span style={{ fontSize: 32, fontWeight: 600, color: '#64748B' }}>• {meaning}</span>
            </div>
          </div>

          {/* Radical Component Breakdown Cards */}
          {frame >= 450 && (
            <div
              style={{
                marginTop: 60,
                width: '100%',
                display: 'flex',
                gap: 24,
                justifyContent: 'center',
                opacity: radicalSpring,
                transform: `translateY(${interpolate(radicalSpring, [0, 1], [40, 0])}px)`,
              }}
            >
              {radicals.map((rad, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    padding: 24,
                    boxShadow: '0 12px 32px rgba(15,23,42,0.08)',
                    border: '1px solid #E2E8F0',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 64, fontWeight: 900, color: '#0F172A', fontFamily: '"Noto Serif SC", serif' }}>
                    {rad.radical}
                  </div>
                  <div style={{ fontSize: 24, color: '#FF6F59', fontWeight: 700, marginTop: 4 }}>{rad.pinyin}</div>
                  <div style={{ fontSize: 20, color: '#475569', fontWeight: 600, marginTop: 8 }}>{rad.meaning}</div>
                </div>
              ))}
            </div>
          )}

          {/* Etymology Mnemonic Story Card */}
          {frame >= 600 && (
            <div
              style={{
                marginTop: 40,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 28,
                padding: '24px 32px',
                width: '100%',
                boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
                border: '1.5px solid rgba(255, 111, 89, 0.2)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: '#FF6F59', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                💡 Etymology Origin
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1E293B', marginTop: 10, lineHeight: 1.4 }}>
                "{story}"
              </div>
            </div>
          )}

          {/* Example Sentence Context Card */}
          {frame >= 750 && (
            <div
              style={{
                marginTop: 36,
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: 28,
                padding: '28px 36px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(15,23,42,0.25)',
                opacity: sentenceSpring,
                transform: `translateY(${interpolate(sentenceSpring, [0, 1], [50, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 18, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>
                Sentence Context
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.5, fontFamily: '"Noto Serif SC", serif' }}>
                {exampleSentence.cn.split(exampleSentence.highlightWord).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span style={{ color: '#FF6F59', backgroundColor: 'rgba(255, 111, 89, 0.2)', padding: '2px 8px', borderRadius: 8 }}>
                        {exampleSentence.highlightWord}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ fontSize: 22, color: '#FF6F59', marginTop: 10, fontWeight: 600 }}>
                {exampleSentence.pinyin}
              </div>
              <div style={{ fontSize: 22, color: '#CBD5E1', marginTop: 8 }}>
                "{exampleSentence.en}"
              </div>
            </div>
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
