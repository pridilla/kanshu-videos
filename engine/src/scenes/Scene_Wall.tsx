import React from 'react';
import { AbsoluteFill, spring, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_GENTLE, FPS, getLocalFrame } from '../shared/constants';
import { FloatingParticles } from '../shared/Icons';

// ────────────────────────────────────────────────────────────
// WALL SCENE — "Every learner gets caught by this..."
// ────────────────────────────────────────────────────────────

export const WallScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 48.553, FPS);
  const fps = FPS;

  const spring1 = spring({ frame, fps, config: SPRING_OVERSHOOT });
  const spring2 = spring({ frame: Math.max(0, frame - 12), fps, config: SPRING_GENTLE });
  const spring3 = spring({ frame: Math.max(0, frame - 28), fps, config: SPRING_GENTLE });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />

      <div
        style={{
          position: 'absolute',
          top: '32%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          maxWidth: 900,
        }}
      >
        <div
          style={{
            transform: `scale(${spring1})`,
            opacity: spring1,
            fontFamily: FONTS.display,
            fontSize: 48,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: '0.02em',
            lineHeight: 1.3,
          }}
        >
          Every learner gets caught by this.
        </div>

        <div
          style={{
            transform: `scale(${spring2})`,
            opacity: spring2,
            fontFamily: FONTS.display,
            fontSize: 40,
            fontWeight: 400,
            color: COLORS.body,
            lineHeight: 1.4,
            marginTop: 24,
          }}
        >
          You can know the character cold
        </div>

        <div
          style={{
            transform: `scale(${spring3})`,
            opacity: spring3,
            fontFamily: FONTS.display,
            fontSize: 40,
            fontWeight: 400,
            color: COLORS.body,
            lineHeight: 1.4,
            marginTop: 8,
          }}
        >
          and still mess it up.
        </div>
      </div>
    </AbsoluteFill>
  );
};
