import React from 'react';
import { AbsoluteFill, spring } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, FPS, getLocalFrame } from '../shared/constants';
import { FloatingParticles } from '../shared/Icons';

// ────────────────────────────────────────────────────────────
// EXAMPLE SCENE — "The sound is ma."
// ────────────────────────────────────────────────────────────

export const ExampleScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 17.612, FPS);
  const fps = FPS;

  const textSpring = spring({ frame, fps, config: SPRING_OVERSHOOT });
  const maSpring = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING_OVERSHOOT });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />

      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: `translateX(-50%)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${textSpring})`,
            opacity: textSpring,
            fontFamily: FONTS.display,
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: '0.02em',
            lineHeight: 1.2,
          }}
        >
          The sound is
        </div>

        <div
          style={{
            transform: `scale(${maSpring})`,
            opacity: maSpring,
            fontFamily: FONTS.display,
            fontSize: 120,
            fontWeight: 800,
            color: COLORS.primary,
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            marginTop: 16,
          }}
        >
          ma
        </div>
      </div>
    </AbsoluteFill>
  );
};
