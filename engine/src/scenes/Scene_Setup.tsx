import React from 'react';
import { AbsoluteFill, spring, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, SPRING_GENTLE, FPS, getLocalFrame } from '../shared/constants';
import { FloatingParticles } from '../shared/Icons';

// ────────────────────────────────────────────────────────────
// SETUP SCENE — pitch wave explanation
// Fixed: frame-based animation (not progress) so sub-sentences
// don't cause reloads.
// ────────────────────────────────────────────────────────────

export const SetupScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 4.899, FPS);
  const fps = FPS;

  // Four wave paths representing the four tones
  const wavePaths = [
    // Tone 1: high flat
    { d: 'M0,60 L200,60', color: COLORS.primary },
    // Tone 2: rising
    { d: 'M0,100 Q100,100 200,20', color: '#FF8A75' },
    // Tone 3: dip-rise
    { d: 'M0,20 Q50,100 100,80 Q150,60 200,20', color: '#FFB4A2' },
    // Tone 4: falling
    { d: 'M0,20 L200,100', color: '#FFD1C7' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />

      {/* Waveform visualization */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 700,
          height: 200,
        }}
      >
        <svg width="700" height="200" viewBox="0 0 800 120">
          {wavePaths.map((wave, i) => {
            const offset = i * 25;
            // Frame-based entrance (staggered by ~0.4s per wave)
            const waveSpring = spring({
              frame: Math.max(0, frame - i * 24),
              fps,
              config: SPRING_GENTLE,
            });

            return (
              <g key={i} opacity={waveSpring} transform={`translate(0, ${offset})`}>
                <path
                  d={wave.d}
                  fill="none"
                  stroke={wave.color}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={300}
                  strokeDashoffset={300 * (1 - waveSpring)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Pitch labels */}
      <div
        style={{
          position: 'absolute',
          top: '62%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 40,
          opacity: interpolate(
            frame,
            [30, 60],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          ),
        }}
      >
        {['High Flat', 'Rising', 'Dip-Rise', 'Falling'].map((label, i) => {
          const labelSpring = spring({
            frame: Math.max(0, frame - 48 - i * 10),
            fps,
            config: SPRING_GENTLE,
          });
          return (
            <div
              key={i}
              style={{
                fontFamily: FONTS.display,
                fontSize: 24,
                color: i === 0 ? COLORS.primary : COLORS.body,
                textAlign: 'center',
                opacity: labelSpring,
                transform: `translateY(${(1 - labelSpring) * 10}px)`,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
