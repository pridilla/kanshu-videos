import React from 'react';
import { AbsoluteFill, interpolate, staticFile } from 'remotion';

export interface ChineseBackgroundProps {
  frame: number;
  lessonTotalFrames?: number;
  morph1To2?: number; // 0 to 1
  morph2To3?: number; // 0 to 1
  morph3To4?: number; // 0 to 1
}

export const ChineseBackground: React.FC<ChineseBackgroundProps> = ({
  frame,
  lessonTotalFrames = 2772,
  morph1To2 = 0,
  morph2To3 = 0,
  morph3To4 = 0,
}) => {
  // ── 1. QUADRATIC INTRO EASE-IN FADE (0 -> 35 frames) ──
  const enterProgress = Math.min(1, Math.max(0, frame / 35));
  const enterOpacity = Math.pow(enterProgress, 2); // Quadratic ease-in: t^2

  // ── 2. QUADRATIC OUTRO EASE-OUT FADE (lessonTotalFrames - 45 -> lessonTotalFrames) ──
  const exitStartFrame = lessonTotalFrames - 45;
  const exitProgress = Math.min(1, Math.max(0, (frame - exitStartFrame) / 45));
  const exitOpacity = Math.pow(1 - exitProgress, 2); // Quadratic ease-out: (1-t)^2

  const totalOpacity = enterOpacity * exitOpacity;

  // ── 3. QUADRATIC SLIDE-UP ENTRANCE POSITION ──
  const enterY = (1 - enterProgress) * (1 - enterProgress) * 50;

  // ── 4. CONTINUOUS & SCREEN-TRANSITION PARALLAX PANNING ──
  const continuousPanY = frame * 0.4;
  const transitionPanX =
    interpolate(morph1To2, [0, 1], [0, 60]) +
    interpolate(morph2To3, [0, 1], [0, -100]) +
    interpolate(morph3To4, [0, 1], [0, 50]);

  const patternScale =
    1.0 +
    interpolate(morph1To2, [0, 1], [0, 0.05]) +
    interpolate(morph2To3, [0, 1], [0, -0.06]) +
    interpolate(morph3To4, [0, 1], [0, 0.05]);

  if (totalOpacity <= 0.001) return null;

  return (
    <AbsoluteFill
      style={{
        opacity: totalOpacity * 0.12, // Subtle opacity level
        transform: `translateY(${enterY}px) scale(${patternScale})`,
        pointerEvents: 'none',
        zIndex: 1, // Layer 1: Strictly behind all text & characters!
        overflow: 'hidden',
      }}
    >
      {/* SEAMLESS ORIENTAL CLOUD LINE-ART PATTERN REPEAT */}
      <div
        style={{
          position: 'absolute',
          top: -600,
          left: -600,
          width: 'calc(100% + 1200px)',
          height: 'calc(100% + 1200px)',
          backgroundImage: `url(${staticFile('chinese_cloud_pattern.png')})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '950px auto',
          backgroundPosition: `${transitionPanX}px ${-continuousPanY}px`,
        }}
      />
    </AbsoluteFill>
  );
};
