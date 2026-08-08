import React from 'react';
import { AbsoluteFill, spring } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, FPS, getLocalFrame } from '../shared/constants';
import { FloatingParticles } from '../shared/Icons';

// ────────────────────────────────────────────────────────────
// HOOK SCENE — "ONE SOUND" / "FOUR WORDS"
// ────────────────────────────────────────────────────────────

export const HookScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 0, FPS);
  const fps = FPS;

  const oneSpring = spring({ frame, fps, config: SPRING_OVERSHOOT });
  const soundSpring = spring({ frame: Math.max(0, frame - 6), fps, config: SPRING_OVERSHOOT });
  const fourSpring = spring({ frame: Math.max(0, frame - 14), fps, config: SPRING_OVERSHOOT });
  const wordsSpring = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING_OVERSHOOT });

  const floatY = Math.sin(frame * 0.05) * 3;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={10} />

      <div
        style={{
          position: 'absolute',
          top: '24%',
          left: '50%',
          transform: `translateX(-50%) translateY(${floatY}px)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${oneSpring})`,
            opacity: oneSpring,
            fontFamily: FONTS.display,
            fontSize: 96,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: '0.04em',
            lineHeight: 1.1,
          }}
        >
          ONE SOUND
        </div>

        <div
          style={{
            transform: `scale(${soundSpring})`,
            opacity: soundSpring,
            fontFamily: FONTS.display,
            fontSize: 80,
            fontWeight: 700,
            color: COLORS.pinyin,
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            marginTop: 4,
          }}
        >
          一个声音
        </div>

        <div
          style={{
            transform: `scale(${fourSpring})`,
            opacity: fourSpring,
            fontFamily: FONTS.display,
            fontSize: 96,
            fontWeight: 700,
            color: COLORS.primary,
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            marginTop: 32,
          }}
        >
          FOUR WORDS
        </div>

        <div
          style={{
            transform: `scale(${wordsSpring})`,
            opacity: wordsSpring,
            fontFamily: FONTS.display,
            fontSize: 80,
            fontWeight: 700,
            color: COLORS.pinyin,
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            marginTop: 4,
          }}
        >
          四个词
        </div>
      </div>
    </AbsoluteFill>
  );
};
