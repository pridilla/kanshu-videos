import React from 'react';
import { AbsoluteFill, spring, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_GENTLE, FPS, getLocalFrame } from '../shared/constants';
import { FloatingParticles } from '../shared/Icons';

// ────────────────────────────────────────────────────────────
// SUMMARY SCENE — "Same sound. Four words. Wrong pitch, wrong word."
// ────────────────────────────────────────────────────────────

export const SummaryScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 43.409, FPS);
  const fps = FPS;

  const spring1 = spring({ frame, fps, config: SPRING_OVERSHOOT });
  const spring2 = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING_OVERSHOOT });
  const spring3 = spring({ frame: Math.max(0, frame - 18), fps, config: SPRING_OVERSHOOT });

  // Four pinyin words fade in
  const pinyins = ['mā', 'má', 'mǎ', 'mà'];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />

      <div
        style={{
          position: 'absolute',
          top: '28%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${spring1})`,
            opacity: spring1,
            fontFamily: FONTS.display,
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: '0.02em',
          }}
        >
          Same sound.
        </div>

        <div
          style={{
            transform: `scale(${spring2})`,
            opacity: spring2,
            fontFamily: FONTS.display,
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: '0.02em',
            marginTop: 12,
          }}
        >
          Four words.
        </div>
      </div>

      {/* Four pinyin in a row */}
      <div
        style={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 32,
        }}
      >
        {pinyins.map((p, i) => {
          const pSpring = spring({ frame: Math.max(0, frame - 24 - i * 6), fps, config: SPRING_GENTLE });
          return (
            <div
              key={i}
              style={{
                transform: `scale(${pSpring})`,
                opacity: pSpring,
                fontFamily: FONTS.pinyin,
                fontSize: 72,
                fontWeight: 800,
                color: COLORS.primary,
              }}
            >
              {p}
            </div>
          );
        })}
      </div>

      {/* Punchline */}
      <div
        style={{
          position: 'absolute',
          top: '66%',
          left: '50%',
          transform: `translateX(-50%) scale(${spring3})`,
          opacity: spring3,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 48,
            fontWeight: 700,
            color: COLORS.primary,
            letterSpacing: '0.02em',
          }}
        >
          Wrong pitch, wrong word.
        </div>
      </div>
    </AbsoluteFill>
  );
};
