import React from 'react';
import { AbsoluteFill, spring, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_GENTLE, FPS, getLocalFrame } from '../shared/constants';
import { FloatingParticles, BookIcon, SoundWaves } from '../shared/Icons';

// ────────────────────────────────────────────────────────────
// SCENE 2: Krashen Book (5.37s - 9.36s)
// Fixed: radiating waves actually expand outward, book has subtle float
// ────────────────────────────────────────────────────────────

export const KrashenScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 5.37, FPS);
  const fps = FPS;

  const bookSpring = spring({ frame, fps, config: SPRING_OVERSHOOT });
  const labelSpring = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING_GENTLE });

  // Book gentle float + pulse
  const floatY = Math.sin(frame * 0.06) * 4;
  const pulseScale = 1 + 0.015 * Math.sin(frame * 0.12);

  // Waves fade in after book settles
  const wavesOpacity = interpolate(
    frame,
    [30, 50],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />

      {/* Book card — glassmorphism with actual animation */}
      <div
        style={{
          position: 'absolute',
          top: '16%',
          left: '50%',
          transform: `translateX(-50%) translateY(${floatY}px) scale(${bookSpring * pulseScale})`,
          opacity: bookSpring,
          width: 360,
          padding: '44px 36px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: 36,
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <BookIcon scale={1.2} />
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 52,
            color: COLORS.primary,
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          KRASHEN
        </div>
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 32,
            color: COLORS.pinyin,
            marginTop: 6,
          }}
        >
          1977
        </div>
      </div>

      {/* Radiating sound waves — these actually expand outward */}
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)', opacity: wavesOpacity }}>
        {[0, 1, 2, 3].map(i => {
          const cycle = ((frame - 30) * 0.08 + i * 0.8) % 3;
          const expandProgress = cycle / 3;
          const scale = 0.8 + expandProgress * 2.5;
          const ringOpacity = (1 - expandProgress) * 0.4;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: `3px solid ${COLORS.primary}`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: ringOpacity,
              }}
            />
          );
        })}
      </div>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: '52%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: FONTS.body,
          fontSize: 28,
          color: COLORS.body,
          opacity: labelSpring,
          textAlign: 'center',
        }}
      >
        studied how children learn
      </div>

      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};
