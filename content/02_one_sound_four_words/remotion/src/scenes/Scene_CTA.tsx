import React from 'react';
import { AbsoluteFill, spring, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_GENTLE, FPS, getLocalFrame } from '../shared/constants';
import { FloatingParticles } from '../shared/Icons';

// ────────────────────────────────────────────────────────────
// CTA SCENE — "Follow kanshu.app..."
// ────────────────────────────────────────────────────────────

export const CTAScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 55.495, FPS);
  const fps = FPS;

  const spring1 = spring({ frame, fps, config: SPRING_OVERSHOOT });
  const spring2 = spring({ frame: Math.max(0, frame - 12), fps, config: SPRING_GENTLE });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={10} />

      <div
        style={{
          position: 'absolute',
          top: '38%',
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
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: '0.02em',
            lineHeight: 1.3,
          }}
        >
          That's how Chinese tones work.
        </div>

        <div
          style={{
            transform: `scale(${spring2})`,
            opacity: spring2,
            fontFamily: FONTS.display,
            fontSize: 40,
            fontWeight: 400,
            color: COLORS.primary,
            lineHeight: 1.4,
            marginTop: 32,
          }}
        >
          Follow kanshu.app to learn more.
        </div>
      </div>

      {/* App logo placeholder */}
      <div
        style={{
          position: 'absolute',
          top: '62%',
          left: '50%',
          transform: `translateX(-50%) scale(${spring2})`,
          opacity: spring2,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: COLORS.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: FONTS.display, fontSize: 36, color: '#fff', fontWeight: 700 }}>
            K
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
