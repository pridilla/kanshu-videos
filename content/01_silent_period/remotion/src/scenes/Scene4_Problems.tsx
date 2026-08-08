import React from 'react';
import { AbsoluteFill, spring, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_GENTLE, SPRING_BOUNCE, FPS, getLocalFrame, easeOutCubic } from '../shared/constants';
import { FloatingParticles, BrainIcon, SpeakerIcon, LightningIcon, SmoothProgressBar, EarIcon } from '../shared/Icons';

// ────────────────────────────────────────────────────────────
// SCENE 7: Problem #1 — Accent (26.38s - 30.22s)
// ────────────────────────────────────────────────────────────

export const OneScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 26.38, FPS);
  const fps = FPS;

  const numSpring = spring({ frame, fps, config: SPRING_BOUNCE });
  const labelSpring = spring({ frame: Math.max(0, frame - 12), fps, config: SPRING_GENTLE });

  // Subtitle fades in
  const subOpacity = time > 28.5
    ? interpolate(time, [28.5, 29.0], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />

      {/* Big "1" */}
      <div
        style={{
          position: 'absolute',
          top: '16%',
          left: '50%',
          transform: `translateX(-50%) scale(${numSpring})`,
          opacity: numSpring,
          fontFamily: FONTS.display,
          fontSize: 180,
          fontWeight: 800,
          color: COLORS.primary,
          lineHeight: 1,
        }}
      >
        1
      </div>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: `translateX(-50%) scale(${labelSpring})`,
          opacity: labelSpring,
          fontFamily: FONTS.display,
          fontSize: 48,
          color: COLORS.text,
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        Strong Foreign Accent
      </div>

      {/* Speaker icon with X */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: `translateX(-50%) scale(${labelSpring})`,
          opacity: labelSpring,
        }}
      >
        <SpeakerIcon scale={2.0} muted />
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: 'absolute',
          top: '56%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: FONTS.body,
          fontSize: 26,
          color: COLORS.pinyin,
          opacity: subOpacity,
          textAlign: 'center',
        }}
      >
        mouth isn't used to the sounds yet
      </div>

      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 8: Problem #2 — Affective Filter (30.58s - 35.99s)
// Fixed: wall rises with ease-out, not linear CSS transition
// ────────────────────────────────────────────────────────────

export const AffectiveScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 30.58, FPS);
  const fps = FPS;

  const numSpring = spring({ frame: Math.max(0, frame - 3), fps, config: SPRING_BOUNCE });

  // Wall rises with eased progress
  const rawWall = Math.min(1, Math.max(0, (time - 32.2) / 1.5));
  const wallRise = easeOutCubic(rawWall);

  // Anxiety bolt
  const boltOpacity = time > 34.0
    ? interpolate(time, [34.0, 34.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />

      {/* Big "2" */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: `translateX(-50%) scale(${numSpring})`,
          opacity: numSpring,
          fontFamily: FONTS.display,
          fontSize: 160,
          fontWeight: 800,
          color: COLORS.primary,
          lineHeight: 1,
        }}
      >
        2
      </div>

      {/* Label above wall */}
      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: '50%',
          transform: `translateX(-50%) scale(${wallRise})`,
          opacity: wallRise,
          fontFamily: FONTS.display,
          fontSize: 32,
          color: COLORS.primary,
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        AFFECTIVE FILTER
      </div>

      {/* Affective Filter wall — grows downward as a container */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 280,
          height: `${wallRise * 260}px`,
          backgroundColor: `${COLORS.primary}18`,
          border: wallRise > 0.05 ? `3px solid ${COLORS.primary}` : '3px solid transparent',
          borderRadius: 12,
          opacity: wallRise,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Brain inside the wall */}
        <div style={{ transform: `scale(${0.8 + 0.2 * wallRise})`, opacity: wallRise }}>
          <BrainIcon scale={1.6} pulse />
        </div>
      </div>

      {/* Anxiety bolt */}
      {boltOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '56%',
            left: '50%',
            transform: `translateX(-50%)`,
            opacity: boltOpacity,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <LightningIcon scale={0.9} flash />
          <span
            style={{
              fontFamily: FONTS.body,
              fontSize: 28,
              color: COLORS.primary,
              fontWeight: 600,
            }}
          >
            anxiety blocks learning
          </span>
        </div>
      )}

      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 9: Brain Stress (36.26s - 38.27s)
// Fixed: brain shrinks with eased curve, not linear
// ────────────────────────────────────────────────────────────

export const BrainBadScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 36.26, FPS);

  // Brain shrinks with ease-in
  const rawShrink = time > 36.7 ? Math.min(1, (time - 36.7) / 1.2) : 0;
  const shrink = rawShrink * rawShrink; // ease-in quadratic
  const scale = 1 - shrink * 0.18;
  const opacity = 1 - shrink * 0.4;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />

      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '50%',
          transform: `translateX(-50%) scale(${scale})`,
          opacity,
        }}
      >
        <BrainIcon scale={2.0} dimmed={shrink > 0.5} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '36%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: FONTS.display,
          fontSize: 48,
          color: COLORS.text,
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        STRESS → WORSE LEARNING
      </div>

      <div
        style={{
          position: 'absolute',
          top: '44%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: FONTS.body,
          fontSize: 28,
          color: COLORS.pinyin,
          textAlign: 'center',
        }}
      >
        the brain learns worse when stressed
      </div>

      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 10: Solution — Just Listen (38.59s - 40.63s)
// ────────────────────────────────────────────────────────────

export const SolutionScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 38.59, FPS);
  const fps = FPS;
  const springVal = spring({ frame, fps, config: SPRING_OVERSHOOT });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />
      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: '50%',
          transform: `translateX(-50%) scale(${springVal})`,
          opacity: springVal,
          textAlign: 'center',
        }}
      >
        <div style={{ fontFamily: FONTS.display, fontSize: 96, color: COLORS.primary, fontWeight: 700, lineHeight: 1.05 }}>
          JUST
        </div>
        <div style={{ fontFamily: FONTS.display, fontSize: 92, color: COLORS.primary, fontWeight: 700, lineHeight: 1.05, marginTop: 8 }}>
          LISTEN
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <EarIcon scale={2.0} wavePhase={springVal} />
        </div>
      </div>
      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 11: A Lot (40.86s - 41.43s)
// ────────────────────────────────────────────────────────────

export const ALotScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 40.86, FPS);
  const fps = FPS;
  const springVal = spring({ frame, fps, config: SPRING_OVERSHOOT });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />
      <div
        style={{
          position: 'absolute',
          top: '28%',
          left: '50%',
          transform: `translateX(-50%) scale(${springVal})`,
          opacity: springVal,
          fontFamily: FONTS.display,
          fontSize: 110,
          color: COLORS.primary,
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        A LOT.
      </div>
      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};
