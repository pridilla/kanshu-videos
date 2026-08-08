import React from 'react';
import { AbsoluteFill, spring, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_GENTLE, SPRING_STIFF, FPS, getLocalFrame, easeOutCubic } from '../shared/constants';
import { FloatingParticles, EarIcon, SmoothProgressBar, BrainIcon } from '../shared/Icons';

// ────────────────────────────────────────────────────────────
// SCENE 3: Silent Period Timeline (9.64s - 14.82s)
// Fixed: smooth eased timeline fill, spring-pop dots, animated ear
// ────────────────────────────────────────────────────────────

export const SilentPeriodScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 9.64, FPS);
  const fps = FPS;

  const headlineSpring = spring({ frame: Math.max(0, frame - 3), fps, config: SPRING_OVERSHOOT });

  // Timeline fill with ease-out (not linear!)
  const rawFill = Math.min(1, (time - 10.5) / 3.5);
  const timelineFill = easeOutCubic(rawFill);

  // Ear icon springs in
  const earSpring = time > 14.0
    ? spring({ frame: Math.max(0, Math.round((time - 14.0) * FPS)), fps, config: SPRING_GENTLE })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={10} />

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: '14%',
          left: '50%',
          transform: `translateX(-50%) scale(${headlineSpring})`,
          opacity: headlineSpring,
          fontFamily: FONTS.display,
          fontSize: 72,
          color: COLORS.text,
          textAlign: 'center',
          letterSpacing: '0.02em',
        }}
      >
        SILENT PERIOD
      </div>

      {/* Timeline bar container */}
      <div
        style={{
          position: 'absolute',
          top: '26%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 640,
          opacity: headlineSpring,
        }}
      >
        <SmoothProgressBar progress={timelineFill} width={640} height={12} />

        {/* Month labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, padding: '0 4px' }}>
          {['0', '3', '6'].map(m => (
            <span key={m} style={{ fontFamily: FONTS.body, fontSize: 26, color: COLORS.text, fontWeight: 600 }}>
              {m}
            </span>
          ))}
        </div>

        {/* Milestone dots with spring pop */}
        {[0, 3, 6].map((m, i) => {
          const leftPct = i * 50;
          const dotActive = timelineFill > i * 0.33 + 0.05;
          const dotFrame = dotActive ? frame - Math.round((10.5 + i * 1.17 - 9.64) * FPS) : -100;
          const dotSpring = spring({ frame: Math.max(0, dotFrame), fps, config: SPRING_OVERSHOOT });

          return (
            <div
              key={m}
              style={{
                position: 'absolute',
                top: -8,
                left: `${leftPct}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: COLORS.primary,
                  transform: `scale(${dotSpring})`,
                  opacity: dotSpring,
                  boxShadow: dotSpring > 0.8 ? `0 0 16px ${COLORS.primary}66` : 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Ear icon + "just listen" */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: `translateX(-50%) scale(${earSpring})`,
          opacity: earSpring,
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <EarIcon scale={1.8} wavePhase={earSpring} />
        </div>
        <div style={{ fontFamily: FONTS.body, fontSize: 30, color: COLORS.body, fontWeight: 500 }}>
          just listen
        </div>
      </div>

      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 4: Don't Speak (15.05s - 16.23s)
// ────────────────────────────────────────────────────────────

export const NoSpeakScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 15.05, FPS);
  const fps = FPS;
  const springVal = spring({ frame, fps, config: SPRING_STIFF });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />
      <div
        style={{
          position: 'absolute',
          top: '38%',
          left: '50%',
          transform: `translateX(-50%) scale(${springVal})`,
          opacity: springVal,
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <EarIcon scale={2.2} muted />
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 68,
            color: COLORS.text,
            letterSpacing: '0.02em',
          }}
        >
          DON'T SPEAK
        </div>
      </div>
      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 5: Comprehensible Input (16.66s - 23.15s)
// Fixed: sound waves actually travel from ear to brain
// ────────────────────────────────────────────────────────────

export const InputScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 16.66, FPS);
  const fps = FPS;

  const labelSpring = spring({ frame: Math.max(0, frame - 5), fps, config: SPRING_GENTLE });
  const textSpring = spring({ frame: Math.max(0, frame - 40), fps, config: SPRING_GENTLE });

  // Sound waves traveling ear → brain
  const waveStart = 17.0;
  const wavePhase = time > waveStart ? (time - waveStart) / 5 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={10} />

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: '50%',
          transform: `translateX(-50%) scale(${labelSpring})`,
          opacity: labelSpring,
          fontFamily: FONTS.display,
          fontSize: 44,
          color: COLORS.primary,
          textAlign: 'center',
        }}
      >
        Comprehensible Input
      </div>

      {/* Input side — ear receiving */}
      <div style={{ position: 'absolute', top: '30%', left: '15%' }}>
        <EarIcon scale={1.6} wavePhase={wavePhase > 0.1 ? 1 : 0} />
      </div>

      {/* Animated waves traveling ear → brain */}
      {wavePhase > 0 && (
        <svg
          style={{
            position: 'absolute',
            top: '32%',
            left: '22%',
            width: '32%',
            height: 60,
            overflow: 'visible',
          }}
          viewBox="0 0 300 60"
        >
          {[0, 1, 2, 3, 4].map(i => {
            const delay = i * 0.15;
            const p = Math.max(0, Math.min(1, (wavePhase - delay) * 2));
            const easedP = easeOutCubic(p);
            const x = 10 + easedP * 260;
            const y = 30 + Math.sin(easedP * Math.PI * 2) * 10;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={4 + easedP * 4}
                fill={COLORS.primary}
                opacity={p * 0.7}
              />
            );
          })}
        </svg>
      )}

      {/* Brain at center-right */}
      <div
        style={{
          position: 'absolute',
          top: '29%',
          left: '54%',
          opacity: labelSpring,
        }}
      >
        <BrainIcon scale={1.6} pulse />
      </div>

      {/* Output barrier */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          right: '12%',
          opacity: labelSpring * 0.5,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 4,
            height: 140,
            backgroundColor: COLORS.primary,
            borderRadius: 2,
            margin: '0 auto 8px',
          }}
        />
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 20,
            color: COLORS.primary,
            fontWeight: 600,
            letterSpacing: '0.1em',
          }}
        >
          NO OUTPUT
        </div>
      </div>

      {/* "sounds → meaning" */}
      <div
        style={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: `translateX(-50%) scale(${textSpring})`,
          opacity: textSpring,
          fontFamily: FONTS.display,
          fontSize: 32,
          color: COLORS.text,
          textAlign: 'center',
        }}
      >
        sounds → meaning
      </div>

      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 6: Two Things Happen (23.58s - 26.15s)
// ────────────────────────────────────────────────────────────

export const TwoThingsScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 23.58, FPS);
  const fps = FPS;
  const springVal = spring({ frame, fps, config: SPRING_OVERSHOOT });

  // Arrow bounces
  const arrowY = Math.sin(frame * 0.12) * 6;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />
      <div
        style={{
          position: 'absolute',
          top: '24%',
          left: '50%',
          transform: `translateX(-50%) scale(${springVal})`,
          opacity: springVal,
          textAlign: 'center',
        }}
      >
        <div style={{ fontFamily: FONTS.display, fontSize: 88, color: COLORS.text, fontWeight: 800, lineHeight: 1.05 }}>
          TWO THINGS
        </div>
        <div style={{ fontFamily: FONTS.display, fontSize: 74, color: COLORS.primary, fontWeight: 700, marginTop: 10, lineHeight: 1.05 }}>
          HAPPEN
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 36,
            color: COLORS.primary,
            marginTop: 20,
            transform: `translateY(${arrowY}px)`,
          }}
        >
          ↓
        </div>
      </div>
      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};
