import React from 'react';
import { AbsoluteFill, spring, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_GENTLE, FPS, getLocalFrame } from '../shared/constants';
import { FloatingParticles } from '../shared/Icons';

// ────────────────────────────────────────────────────────────
// TONE SCENE — reusable component for each of the 4 tones
// Fixed: frame-based wave animation (not progress) so sub-sentences
// don't cause reloads.
// ────────────────────────────────────────────────────────────

interface ToneSceneProps {
  time: number;
  progress: number;
  toneNumber: number;
  pinyin: string;
  chineseChar: string;
  english: string;
  description: string;
  /** SVG path representing the tone pitch contour */
  wavePath: string;
  sceneStart: number;
}

export const ToneScene: React.FC<ToneSceneProps> = ({
  time,
  progress,
  toneNumber,
  pinyin,
  chineseChar,
  english,
  description,
  wavePath,
  sceneStart,
}) => {
  const frame = getLocalFrame(time, sceneStart, FPS);
  const fps = FPS;

  const labelSpring = spring({ frame, fps, config: SPRING_OVERSHOOT });
  const descSpring = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING_GENTLE });
  const pinyinSpring = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING_OVERSHOOT });
  const charSpring = spring({ frame: Math.max(0, frame - 30), fps, config: SPRING_OVERSHOOT });

  // Wave animation — frame-based so it never resets on sentence change
  const waveProgress = interpolate(
    frame,
    [12, 48], // 0.2s to 0.8s after scene start
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />

      {/* Tone number label */}
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: '50%',
          transform: `translateX(-50%) scale(${labelSpring})`,
          opacity: labelSpring,
          fontFamily: FONTS.display,
          fontSize: 36,
          fontWeight: 700,
          color: COLORS.body,
          letterSpacing: '0.08em',
        }}
      >
        TONE {toneNumber}
      </div>

      {/* Description */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '50%',
          transform: `translateX(-50%)`,
          textAlign: 'center',
          opacity: descSpring,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 32,
            color: COLORS.body,
            lineHeight: 1.3,
            maxWidth: 700,
          }}
        >
          {description}
        </div>
      </div>

      {/* Tone wave visualization */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 150,
        }}
      >
        <svg width="600" height="150" viewBox="0 0 600 150">
          {/* Baseline */}
          <line x1="0" y1="75" x2="600" y2="75" stroke={COLORS.border} strokeWidth={2} />
          {/* Tone wave */}
          <path
            d={wavePath}
            fill="none"
            stroke={COLORS.primary}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={800}
            strokeDashoffset={800 * (1 - waveProgress)}
          />
          {/* End dot */}
          {waveProgress > 0.9 && (
            <circle cx="580" cy={getWaveEndY(wavePath)} r={8} fill={COLORS.primary} />
          )}
        </svg>
      </div>

      {/* Pinyin (large) */}
      <div
        style={{
          position: 'absolute',
          top: '52%',
          left: '50%',
          transform: `translateX(-50%) scale(${pinyinSpring})`,
          opacity: pinyinSpring,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.pinyin,
            fontSize: 120,
            fontWeight: 800,
            color: COLORS.primary,
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}
        >
          {pinyin}
        </div>
      </div>

      {/* Chinese character */}
      <div
        style={{
          position: 'absolute',
          top: '68%',
          left: '50%',
          transform: `translateX(-50%) scale(${charSpring})`,
          opacity: charSpring,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 80,
            fontWeight: 700,
            color: COLORS.text,
            lineHeight: 1,
          }}
        >
          {chineseChar}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Helper to get the end Y coordinate of a wave path for the dot
function getWaveEndY(path: string): number {
  // Simple extraction: look for the last Y coordinate in the path
  const matches = path.match(/[\d.]+/g);
  if (!matches) return 75;
  // Last number is likely the Y coordinate
  const lastNum = parseFloat(matches[matches.length - 1]);
  return isNaN(lastNum) ? 75 : lastNum;
}

// ────────────────────────────────────────────────────────────
// Pre-configured tone scenes
// ────────────────────────────────────────────────────────────

export const Tone1Scene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => (
  <ToneScene
    time={time}
    progress={progress}
    toneNumber={1}
    pinyin="mā"
    chineseChar="妈"
    english="Mother"
    description="High and flat. Like you're singing."
    wavePath="M0,30 L600,30"
    sceneStart={20.944}
  />
);

export const Tone2Scene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => (
  <ToneScene
    time={time}
    progress={progress}
    toneNumber={2}
    pinyin="má"
    chineseChar="麻"
    english="Hemp"
    description="Start low, rise up. Like you're surprised."
    wavePath="M0,120 Q300,120 600,20"
    sceneStart={26.285}
  />
);

export const Tone3Scene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => (
  <ToneScene
    time={time}
    progress={progress}
    toneNumber={3}
    pinyin="mǎ"
    chineseChar="马"
    english="Horse"
    description="Dip down, come back up. Like you're thinking."
    wavePath="M0,20 Q200,130 400,90 T600,20"
    sceneStart={31.881}
  />
);

export const Tone4Scene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => (
  <ToneScene
    time={time}
    progress={progress}
    toneNumber={4}
    pinyin="mà"
    chineseChar="骂"
    english="Scold"
    description="Drop hard and fast. Like an order."
    wavePath="M0,20 L600,130"
    sceneStart={38.185}
  />
);
