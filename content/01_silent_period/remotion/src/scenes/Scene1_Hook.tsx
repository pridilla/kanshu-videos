import React from 'react';
import { AbsoluteFill, spring, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_STIFF, FPS, getLocalFrame } from '../shared/constants';
import { FloatingParticles, CrossStroke } from '../shared/Icons';

// ────────────────────────────────────────────────────────────
// HOOK SCENE — "START SPEAKING" crossed out with animated X strokes
// Fixed: local frames for springs, proper stroke animation, no CSS transitions
// ────────────────────────────────────────────────────────────

export const HookScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 0, FPS);
  const fps = FPS;

  // Staggered spring entrances using LOCAL frame
  const startSpring = spring({ frame, fps, config: SPRING_OVERSHOOT });
  const speakingSpring = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING_OVERSHOOT });
  const xStrokeSpring = spring({ frame: Math.max(0, frame - 18), fps, config: SPRING_STIFF });
  const wrongSpring = spring({ frame: Math.max(0, frame - 35), fps, config: SPRING_OVERSHOOT });

  // Slight floating motion for the text group
  const floatY = Math.sin(frame * 0.05) * 3;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={10} />

      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: '50%',
          transform: `translateX(-50%) translateY(${floatY}px)`,
          textAlign: 'center',
        }}
      >
        {/* START */}
        <div
          style={{
            transform: `scale(${startSpring})`,
            opacity: startSpring,
            fontFamily: FONTS.display,
            fontSize: 110,
            fontWeight: 700,
            color: COLORS.primary,
            letterSpacing: '0.04em',
            lineHeight: 1.1,
          }}
        >
          START
        </div>

        {/* SPEAKING */}
        <div
          style={{
            transform: `scale(${speakingSpring})`,
            opacity: speakingSpring,
            fontFamily: FONTS.display,
            fontSize: 100,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            marginTop: 8,
          }}
        >
          SPEAKING
        </div>

        {/* Animated X cross */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: xStrokeSpring,
          }}
        >
          <CrossStroke progress={xStrokeSpring} size={520} />
        </div>

        {/* WRONG. */}
        <div
          style={{
            transform: `scale(${wrongSpring})`,
            opacity: wrongSpring,
            fontFamily: FONTS.display,
            fontSize: 92,
            fontWeight: 800,
            color: COLORS.primary,
            marginTop: 60,
            letterSpacing: '0.02em',
          }}
        >
          WRONG.
        </div>
      </div>

      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// TRANS1 SCENE — "Here's why" (4.26s - 4.93s)
// Separate from HookScene to avoid identical content during transition
// ────────────────────────────────────────────────────────────

export const Trans1Scene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 4.26, FPS);
  const fps = FPS;

  const springVal = spring({ frame, fps, config: SPRING_OVERSHOOT });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />

      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: `translateX(-50%) scale(${springVal})`,
          opacity: springVal,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 96,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: '0.02em',
            lineHeight: 1.1,
          }}
        >
          HERE'S
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 96,
            fontWeight: 700,
            color: COLORS.primary,
            letterSpacing: '0.02em',
            lineHeight: 1.1,
            marginTop: 8,
          }}
        >
          WHY.
        </div>
      </div>
    </AbsoluteFill>
  );
};
