import React from 'react';
import { spring, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, FPS, SPRING_GENTLE, getCurrentWord } from '../shared/constants';

// ────────────────────────────────────────────────────────────
// SUBTITLE BAR — highlights current word using word-level timing
// ────────────────────────────────────────────────────────────

interface SubtitleBarProps {
  text: string;
  time: number;
  startTime: number;
  endTime: number;
}

export const SubtitleBar: React.FC<SubtitleBarProps> = ({ text, time, startTime, endTime }) => {
  const localFrame = Math.max(0, Math.round((time - startTime) * FPS));

  const entranceSpring = spring({
    frame: Math.min(localFrame, 20),
    fps: FPS,
    config: SPRING_GENTLE,
  });

  const fadeOut = interpolate(
    time,
    [endTime - 0.25, endTime],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );

  const opacity = entranceSpring * fadeOut;
  const yOffset = (1 - entranceSpring) * 20;

  // Find current word
  const currentWord = getCurrentWord(time);
  const words = text.split(/\s+/);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 140,
        left: 48,
        right: 48,
        opacity,
        transform: `translateY(${yOffset}px)`,
        backgroundColor: 'rgba(245, 245, 245, 0.95)',
        borderRadius: 24,
        padding: '18px 28px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '4px 8px',
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {words.map((word, i) => {
        const cleanWord = word.replace(/[.,!?;:—'"]/g, '').toLowerCase();
        const isCurrent = currentWord && cleanWord === currentWord.word.replace(/[.,!?;:—'"]/g, '').toLowerCase();
        return (
          <span
            key={i}
            style={{
              fontFamily: FONTS.body,
              fontSize: 34,
              fontWeight: isCurrent ? 700 : 400,
              color: isCurrent ? COLORS.primary : COLORS.text,
              lineHeight: 1.4,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
