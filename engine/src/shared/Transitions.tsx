import React from 'react';
import { interpolate, Easing } from 'remotion';
import { TRANSITION_DURATION } from './constants';

// ────────────────────────────────────────────────────────────
// SCENE TRANSITION COMPONENTS
// These handle cross-fade + slide between scenes using absolute time
// ────────────────────────────────────────────────────────────

interface TransitionWrapperProps {
  time: number;
  sceneStart: number;
  sceneEnd: number;
  children: React.ReactNode;
}

// Slide in from right + fade (entering scene)
export const SlideInRight: React.FC<TransitionWrapperProps> = ({ time, sceneStart, sceneEnd, children }) => {
  const dur = TRANSITION_DURATION;
  const enterProgress = Math.min(1, Math.max(0, (time - sceneStart) / dur));
  const exitProgress = Math.max(0, Math.min(1, (time - (sceneEnd - dur)) / dur));

  const enter = Easing.out(Easing.cubic)(enterProgress);
  const exit = Easing.in(Easing.cubic)(exitProgress);

  const x = interpolate(enter, [0, 1], [120, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = Math.min(enter, 1 - exit);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translateX(${x}px)`,
        opacity,
      }}
    >
      {children}
    </div>
  );
};

// Slide out to left + fade (exiting scene)
export const SlideOutLeft: React.FC<TransitionWrapperProps> = ({ time, sceneStart, sceneEnd, children }) => {
  const dur = TRANSITION_DURATION;
  const exitProgress = Math.max(0, Math.min(1, (time - (sceneEnd - dur)) / dur));
  const exit = Easing.in(Easing.cubic)(exitProgress);

  const x = interpolate(exit, [0, 1], [0, -80], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = 1 - exit;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translateX(${x}px)`,
        opacity,
        pointerEvents: 'none',
      }}
    >
      {children}
    </div>
  );
};

// Scale + fade entrance
export const ScaleFadeIn: React.FC<TransitionWrapperProps> = ({ time, sceneStart, sceneEnd, children }) => {
  const dur = TRANSITION_DURATION;
  const enterProgress = Math.min(1, Math.max(0, (time - sceneStart) / dur));
  const exitProgress = Math.max(0, Math.min(1, (time - (sceneEnd - dur)) / dur));

  const enter = Easing.out(Easing.cubic)(enterProgress);
  const exit = Easing.in(Easing.cubic)(exitProgress);

  const scale = 0.85 + 0.15 * enter;
  const opacity = Math.min(enter, 1 - exit);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {children}
    </div>
  );
};

// Simple fade (for subtle transitions)
export const FadeTransition: React.FC<TransitionWrapperProps> = ({ time, sceneStart, sceneEnd, children }) => {
  const dur = TRANSITION_DURATION;
  const enterProgress = Math.min(1, Math.max(0, (time - sceneStart) / dur));
  const exitProgress = Math.max(0, Math.min(1, (time - (sceneEnd - dur)) / dur));

  const enter = Easing.out(Easing.quad)(enterProgress);
  const exit = Easing.in(Easing.quad)(exitProgress);
  const opacity = Math.min(enter, 1 - exit);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
      }}
    >
      {children}
    </div>
  );
};
