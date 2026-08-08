import React from 'react';
import { spring } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, FPS } from './constants';

// ────────────────────────────────────────────────────────────
// TEXT BRIDGE — in-scene text overlay for short sentences
// Instead of a jarring scene cut, text animates IN on the
// previous scene and stays visible until the next scene starts.
// ────────────────────────────────────────────────────────────

interface TextBridgeProps {
  text: string;
  time: number;
  startTime: number;
  endTime: number;
  /** When the next non-overlay scene starts (bridges the gap) */
  bridgeUntil?: number;
}

export const TextBridge: React.FC<TextBridgeProps> = ({
  text,
  time,
  startTime,
  endTime,
  bridgeUntil,
}) => {
  const fps = FPS;
  const localFrame = Math.max(0, Math.round((time - startTime) * fps));

  // Spring in at sentence start
  const entrance = spring({ frame: localFrame, fps, config: SPRING_OVERSHOOT });

  // Fade out starts at sentence end, completes by bridgeUntil or endTime + 0.4s
  const fadeStart = endTime;
  const fadeEnd = bridgeUntil ?? endTime + 0.4;
  const fadeProgress =
    time > fadeStart
      ? Math.min(1, Math.max(0, (time - fadeStart) / (fadeEnd - fadeStart)))
      : 0;
  const opacity = entrance * (1 - fadeProgress);

  // Subtle float
  const floatY = Math.sin(localFrame * 0.04) * 2;

  // Split text for visual emphasis on key words
  const words = text.split(' ');
  const midPoint = Math.ceil(words.length / 2);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 620,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateY(${floatY}px) scale(${0.9 + 0.1 * entrance})`,
        opacity,
        pointerEvents: 'none',
        zIndex: 20,
        padding: '0 60px',
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 52,
          color: COLORS.text,
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: '0.01em',
          textWrap: 'balance',
        }}
      >
        {words.slice(0, midPoint).join(' ')}
      </div>
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 52,
          color: COLORS.primary,
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: '0.01em',
          marginTop: 4,
          textWrap: 'balance',
        }}
      >
        {words.slice(midPoint).join(' ')}
      </div>
    </div>
  );
};
