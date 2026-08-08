import React from 'react';
import { interpolate, spring, useCurrentFrame, random } from 'remotion';
import { COLORS, FPS, SPRING_OVERSHOOT, SPRING_GENTLE } from '../shared/constants';

// ────────────────────────────────────────────────────────────
// ANIMATED SVG ICON LIBRARY
// All icons are hand-coded SVG with animated stroke-dashoffset,
// scale springs, and continuous motion. No emoji.
// ────────────────────────────────────────────────────────────

// Hook: Animated X cross stroke
export const CrossStroke: React.FC<{ progress: number; size?: number }> = ({ progress, size = 500 }) => {
  const strokeLen = Math.sqrt(2) * size;
  return (
    <svg width={size} height={size * 0.24} viewBox={`0 0 ${size} ${size * 0.24}`} style={{ overflow: 'visible' }}>
      <line
        x1="0" y1="0" x2={size} y2={size * 0.24}
        stroke={COLORS.primary}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={strokeLen}
        strokeDashoffset={strokeLen * (1 - progress)}
      />
      <line
        x1={size} y1="0" x2="0" y2={size * 0.24}
        stroke={COLORS.primary}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={strokeLen}
        strokeDashoffset={strokeLen * (1 - progress)}
      />
    </svg>
  );
};

// Ear icon with listening waves
export const EarIcon: React.FC<{ scale?: number; wavePhase?: number; muted?: boolean }> = ({ scale = 1, wavePhase = 0, muted = false }) => {
  return (
    <div style={{ position: 'relative', width: 80 * scale, height: 100 * scale }}>
      <svg width={80 * scale} height={100 * scale} viewBox="0 0 80 100" fill="none">
        {/* Outer ear shape */}
        <path
          d="M40 8C22 8 12 24 12 44C12 60 20 72 28 80C32 84 34 88 34 92H46C46 86 44 82 40 78C32 70 26 60 26 44C26 30 32 20 40 20C48 20 54 30 54 44C54 52 52 58 50 62"
          stroke={muted ? COLORS.pinyin : COLORS.primary}
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
        {/* Inner ear detail */}
        <path
          d="M40 32C36 32 34 38 34 44C34 50 36 56 40 58"
          stroke={muted ? COLORS.pinyin : COLORS.primary}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {muted && (
        <div style={{ position: 'absolute', top: -8, right: -10, fontSize: 40 * scale, color: COLORS.primary, fontWeight: 800 }}>
          ✕
        </div>
      )}
      {!muted && wavePhase > 0 && (
        <>
          {[0, 1, 2].map(i => {
            const p = Math.max(0, Math.min(1, wavePhase * 3 - i));
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  right: -20 - i * 12,
                  top: '50%',
                  width: 12 + i * 8,
                  height: 20 + i * 14,
                  border: `3px solid ${COLORS.primary}`,
                  borderRadius: '50%',
                  borderLeftColor: 'transparent',
                  transform: `translateY(-50%) scale(${p})`,
                  opacity: p * 0.6,
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

// Brain icon
export const BrainIcon: React.FC<{ scale?: number; pulse?: boolean; dimmed?: boolean }> = ({ scale = 1, pulse = false, dimmed = false }) => {
  const frame = useCurrentFrame();
  const pulseScale = pulse ? 1 + 0.04 * Math.sin(frame * 0.15) : 1;
  const color = dimmed ? COLORS.pinyin : COLORS.primary;
  return (
    <svg width={90 * scale * pulseScale} height={80 * scale * pulseScale} viewBox="0 0 90 80" fill="none" style={{ overflow: 'visible' }}>
      {/* Left hemisphere */}
      <path
        d="M45 8C28 8 16 22 16 40C16 54 24 66 34 72C38 74 42 76 45 76"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      {/* Right hemisphere */}
      <path
        d="M45 8C62 8 74 22 74 40C74 54 66 66 56 72C52 74 48 76 45 76"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      {/* Center line */}
      <line x1="45" y1="8" x2="45" y2="76" stroke={color} strokeWidth={3} strokeLinecap="round" />
      {/* Detail curves */}
      <path d="M28 30C32 28 36 32 34 36" stroke={color} strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M62 30C58 28 54 32 56 36" stroke={color} strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M30 50C34 48 38 52 36 56" stroke={color} strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M60 50C56 48 52 52 54 56" stroke={color} strokeWidth={3} strokeLinecap="round" fill="none" />
    </svg>
  );
};

// Book icon with pages
export const BookIcon: React.FC<{ scale?: number; open?: boolean }> = ({ scale = 1, open = false }) => {
  return (
    <svg width={70 * scale} height={80 * scale} viewBox="0 0 70 80" fill="none">
      {/* Spine */}
      <line x1="35" y1="5" x2="35" y2="75" stroke={COLORS.primary} strokeWidth={4} strokeLinecap="round" />
      {/* Left page */}
      <path
        d={open ? "M35 5C15 5 5 20 5 40C5 55 15 70 35 75" : "M35 5C20 5 10 15 10 40C10 60 20 70 35 75"}
        stroke={COLORS.primary}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
      {/* Right page */}
      <path
        d={open ? "M35 5C55 5 65 20 65 40C65 55 55 70 35 75" : "M35 5C50 5 60 15 60 40C60 60 50 70 35 75"}
        stroke={COLORS.primary}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
      {/* Page lines */}
      <line x1="18" y1="25" x2="30" y2="25" stroke={COLORS.pinyin} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
      <line x1="18" y1="35" x2="28" y2="35" stroke={COLORS.pinyin} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
      <line x1="40" y1="25" x2="52" y2="25" stroke={COLORS.pinyin} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
      <line x1="42" y1="35" x2="52" y2="35" stroke={COLORS.pinyin} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
    </svg>
  );
};

// Sound wave radiating circles
export const SoundWaves: React.FC<{ time: number; x: number; y: number; color?: string }> = ({ time, x, y, color = COLORS.primary }) => {
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
      {[0, 1, 2, 3].map(i => {
        const cycle = (time * 2 + i * 0.5) % 3;
        const progress = cycle / 3;
        const scale = 0.5 + progress * 1.5;
        const opacity = (1 - progress) * 0.5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: `2px solid ${color}`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};

// Speaker with sound waves (muted variant too)
export const SpeakerIcon: React.FC<{ scale?: number; muted?: boolean; waveActive?: boolean; time?: number }> = ({ scale = 1, muted = false, waveActive = false, time = 0 }) => {
  return (
    <div style={{ position: 'relative', width: 80 * scale, height: 80 * scale }}>
      <svg width={80 * scale} height={80 * scale} viewBox="0 0 80 80" fill="none">
        {/* Speaker body */}
        <path d="M15 28H5V52H15L35 68V12L15 28Z" stroke={muted ? COLORS.pinyin : COLORS.primary} strokeWidth={5} strokeLinejoin="round" fill="none" />
        {/* Sound waves */}
        {!muted && (
          <>
            <path d="M42 22C52 28 52 52 42 58" stroke={COLORS.primary} strokeWidth={4} strokeLinecap="round" fill="none" />
            <path d="M52 14C68 24 68 56 52 66" stroke={COLORS.primary} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.6} />
          </>
        )}
      </svg>
      {muted && (
        <div style={{ position: 'absolute', top: -4, right: -8, fontSize: 36 * scale, color: COLORS.primary, fontWeight: 800 }}>
          ✕
        </div>
      )}
      {waveActive && !muted && time > 0 && (
        <div style={{ position: 'absolute', right: -30, top: '50%', transform: 'translateY(-50%)' }}>
          {[0, 1, 2].map(i => {
            const p = Math.max(0, Math.min(1, ((time * 3) % 4) - i * 0.6));
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: i * 14,
                  top: -8 - i * 2,
                  width: 4,
                  height: 16 + i * 8,
                  backgroundColor: COLORS.primary,
                  borderRadius: 2,
                  transform: `scaleY(${p})`,
                  opacity: p * 0.7,
                  transformOrigin: 'center',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// TV / Monitor icon
export const TVIcon: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <svg width={80 * scale} height={65 * scale} viewBox="0 0 80 65" fill="none">
    <rect x="4" y="10" width="72" height="48" rx="6" stroke={COLORS.primary} strokeWidth={4} fill="none" />
    <line x1="28" y1="58" x2="52" y2="58" stroke={COLORS.primary} strokeWidth={4} strokeLinecap="round" />
    <line x1="40" y1="58" x2="40" y2="62" stroke={COLORS.primary} strokeWidth={4} strokeLinecap="round" />
    <rect x="12" y="18" width="56" height="32" rx="3" stroke={COLORS.primary} strokeWidth={2} fill="none" opacity={0.3} />
  </svg>
);

// Headphones icon
export const HeadphonesIcon: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <svg width={80 * scale} height={70 * scale} viewBox="0 0 80 70" fill="none">
    <path d="M12 48V35C12 18 24 6 40 6C56 6 68 18 68 35V48" stroke={COLORS.primary} strokeWidth={5} strokeLinecap="round" fill="none" />
    <rect x="4" y="40" width="18" height="26" rx="6" stroke={COLORS.primary} strokeWidth={4} fill="none" />
    <rect x="58" y="40" width="18" height="26" rx="6" stroke={COLORS.primary} strokeWidth={4} fill="none" />
  </svg>
);

// Open book / reading icon
export const ReadingIcon: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <svg width={70 * scale} height={60 * scale} viewBox="0 0 70 60" fill="none">
    <path d="M35 10C25 4 10 4 4 10V50C10 44 25 44 35 50" stroke={COLORS.primary} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M35 10C45 4 60 4 66 10V50C60 44 45 44 35 50" stroke={COLORS.primary} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <line x1="14" y1="18" x2="28" y2="18" stroke={COLORS.pinyin} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
    <line x1="14" y1="26" x2="26" y2="26" stroke={COLORS.pinyin} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
    <line x1="42" y1="18" x2="56" y2="18" stroke={COLORS.pinyin} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
    <line x1="44" y1="26" x2="56" y2="26" stroke={COLORS.pinyin} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
  </svg>
);

// Lightning bolt icon
export const LightningIcon: React.FC<{ scale?: number; flash?: boolean }> = ({ scale = 1, flash = false }) => {
  const frame = useCurrentFrame();
  const flashOpacity = flash ? 0.5 + 0.5 * Math.sin(frame * 0.3) : 1;
  return (
    <svg width={40 * scale} height={60 * scale} viewBox="0 0 40 60" fill="none" style={{ opacity: flashOpacity }}>
      <path d="M22 4L6 32H18L14 56L34 24H20L22 4Z" stroke={COLORS.primary} strokeWidth={4} strokeLinejoin="round" fill="none" />
    </svg>
  );
};

// Checkmark icon
export const CheckIcon: React.FC<{ scale?: number; drawProgress?: number }> = ({ scale = 1, drawProgress = 1 }) => {
  const len = 40;
  return (
    <svg width={50 * scale} height={50 * scale} viewBox="0 0 50 50" fill="none">
      <path
        d="M10 26L20 36L40 14"
        stroke={COLORS.primary}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - drawProgress)}
      />
    </svg>
  );
};

// Progress bar with smooth fill
export const SmoothProgressBar: React.FC<{ progress: number; width?: number; height?: number; color?: string; bgColor?: string }> = ({ progress, width = 600, height = 16, color = COLORS.primary, bgColor = COLORS.border }) => {
  return (
    <div style={{ width, height, backgroundColor: bgColor, borderRadius: height / 2, overflow: 'hidden' }}>
      <div
        style={{
          width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: height / 2,
        }}
      />
    </div>
  );
};

// Timeline dot with spring pop
export const TimelineDot: React.FC<{ active: boolean; size?: number }> = ({ active, size = 24 }) => {
  const frame = useCurrentFrame();
  const s = active ? spring({ frame, fps: FPS, config: SPRING_OVERSHOOT }) : 0;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: COLORS.primary,
        transform: `translateX(-50%) scale(${s})`,
        opacity: s,
      }}
    />
  );
};

// Arrow down animated
export const BounceArrow: React.FC<{ time: number }> = ({ time }) => {
  const y = Math.sin(time * 4) * 8;
  return (
    <div style={{ fontSize: 40, color: COLORS.primary, transform: `translateY(${y}px)`, fontFamily: FONTS.display }}>
      ↓
    </div>
  );
};

// Floating particles (100% deterministic)
export const FloatingParticles: React.FC<{ count?: number; color?: string }> = ({ count = 12, color = '#E2E8F0' }) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seedX = random(`particle-x-${i}`);
      const seedY = random(`particle-y-${i}`);
      const seedSpeed = random(`particle-speed-${i}`);
      const seedDrift = random(`particle-drift-${i}`);
      const seedPhase = random(`particle-phase-${i}`);
      return {
        id: i,
        x: seedX * 1080,
        y: seedY * 1920,
        size: 3 + seedSpeed * 6,
        speed: 0.2 + seedSpeed * 0.5,
        drift: (seedDrift - 0.5) * 1.5,
        phase: seedPhase * Math.PI * 2,
        opacityBase: 0.15 + seedSpeed * 0.15,
      };
    });
  }, [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map(p => {
        const yPos = ((p.y - frame * p.speed) % 1920 + 1920) % 1920;
        const xDrift = p.drift * 15 * Math.sin(frame * 0.02 + p.phase);
        const opacity = p.opacityBase + p.opacityBase * Math.sin(frame * 0.03 + p.phase);
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x + xDrift,
              top: yPos,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};
