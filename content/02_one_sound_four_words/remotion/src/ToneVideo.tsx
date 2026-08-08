import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Audio, staticFile } from 'remotion';
import {
  SENTENCES,
  getProgressInSentence,
  getBaseSentenceIndexAtTime,
  getNextBaseSentenceIndex,
  isOverlaySentence,
  FPS,
  WIDTH,
  HEIGHT,
  TRANSITION_DURATION,
  COLORS,
  TOTAL_DURATION,
} from './shared/constants';
import { FloatingParticles } from './shared/Icons';
import { SubtitleBar } from './shared/SubtitleBar';
import { TextBridge } from './shared/TextBridge';

// Import all scenes
import { HookScene } from './scenes/Scene_Hook';
import { SetupScene } from './scenes/Scene_Setup';
import { ExampleScene } from './scenes/Scene_Example';
import { Tone1Scene, Tone2Scene, Tone3Scene, Tone4Scene } from './scenes/Scene_Tones';
import { SummaryScene } from './scenes/Scene_Summary';
import { WallScene } from './scenes/Scene_Wall';
import { CTAScene } from './scenes/Scene_CTA';

// ────────────────────────────────────────────────────────────
// SCENE DISPATCHER
// ────────────────────────────────────────────────────────────

const getSceneKey = (sentenceKey: string): string => {
  switch (sentenceKey) {
    case 'open':
    case 'hook':
      return 'HookScene';
    case 'setup1':
    case 'setup2':
    case 'setup3':
    case 'setup4':
    case 'setup5':
      return 'SetupScene';
    case 'setup7':
      return 'ExampleScene';
    case 't1':
    case 't1d1':
    case 't1d2':
    case 't1pinyin':
      return 'Tone1Scene';
    case 't2':
    case 't2d1':
    case 't2d2':
    case 't2pinyin':
      return 'Tone2Scene';
    case 't3':
    case 't3d1':
    case 't3d2':
    case 't3pinyin':
      return 'Tone3Scene';
    case 't4':
    case 't4d1':
    case 't4d2':
    case 't4pinyin':
      return 'Tone4Scene';
    case 'sum1':
    case 'sum2':
    case 'sum3':
    case 'sum4':
      return 'SummaryScene';
    case 'wall1':
    case 'wall2':
    case 'wall3':
      return 'WallScene';
    case 'cta1':
    case 'cta2':
      return 'CTAScene';
    default:
      return 'default';
  }
};

const SceneRenderer: React.FC<{ time: number; sentence: (typeof SENTENCES)[0] }> = ({
  time,
  sentence,
}) => {
  const progress = getProgressInSentence(time, sentence);
  const key = sentence.key;

  switch (key) {
    case 'open':
    case 'hook':
      return <HookScene time={time} progress={progress} />;
    case 'setup1':
    case 'setup2':
    case 'setup3':
    case 'setup4':
    case 'setup5':
      return <SetupScene time={time} progress={progress} />;
    case 'setup7':
      return <ExampleScene time={time} progress={progress} />;
    case 't1':
    case 't1d1':
    case 't1d2':
    case 't1pinyin':
      return <Tone1Scene time={time} progress={progress} />;
    case 't2':
    case 't2d1':
    case 't2d2':
    case 't2pinyin':
      return <Tone2Scene time={time} progress={progress} />;
    case 't3':
    case 't3d1':
    case 't3d2':
    case 't3pinyin':
      return <Tone3Scene time={time} progress={progress} />;
    case 't4':
    case 't4d1':
    case 't4d2':
    case 't4pinyin':
      return <Tone4Scene time={time} progress={progress} />;
    case 'sum1':
    case 'sum2':
    case 'sum3':
    case 'sum4':
      return <SummaryScene time={time} progress={progress} />;
    case 'wall1':
    case 'wall2':
    case 'wall3':
      return <WallScene time={time} progress={progress} />;
    case 'cta1':
    case 'cta2':
      return <CTAScene time={time} progress={progress} />;
    default:
      return <FloatingParticles count={8} />;
  }
};

// ────────────────────────────────────────────────────────────
// MAIN VIDEO COMPONENT
// ────────────────────────────────────────────────────────────

export const ToneVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const time = frame / FPS;

  // ── SUBTITLE: strict audio timing ──
  const currentIdx = SENTENCES.findIndex((s) => time >= s.start && time <= s.end);
  const currentSentence = currentIdx >= 0 ? SENTENCES[currentIdx] : null;

  // ── BASE SCENE: determined by nearest non-overlay sentence ──
  const baseIdx = getBaseSentenceIndexAtTime(time);
  const baseSentence = SENTENCES[baseIdx];

  // ── NEXT BASE SCENE: for transition detection ──
  const nextBaseIdx = getNextBaseSentenceIndex(baseIdx);
  const nextBaseSentence = nextBaseIdx > baseIdx ? SENTENCES[nextBaseIdx] : null;

  // ── OVERLAY: if current sentence is an overlay, render its text ──
  const overlaySentence = currentSentence && isOverlaySentence(currentSentence.key)
    ? currentSentence
    : null;

  // Also keep overlay text visible during the gap after it ends
  const pendingOverlay = !overlaySentence && currentIdx >= 0 && currentSentence
    ? null
    : (() => {
        let prevIdx = -1;
        if (currentIdx >= 0) {
          prevIdx = currentIdx - 1;
        } else {
          for (let i = SENTENCES.length - 1; i >= 0; i--) {
            if (SENTENCES[i].end <= time) { prevIdx = i; break; }
          }
        }
        if (prevIdx >= 0 && isOverlaySentence(SENTENCES[prevIdx].key)) {
          const nextNonOverlayIdx = getNextBaseSentenceIndex(prevIdx);
          if (time < SENTENCES[nextNonOverlayIdx].start) {
            return SENTENCES[prevIdx];
          }
        }
        return null;
      })();

  const activeOverlay = overlaySentence || pendingOverlay;

  // ── TRANSITION MATH ──
  const transitionDur = TRANSITION_DURATION;
  const sceneVisualEnd = nextBaseSentence ? nextBaseSentence.start : baseSentence.end;
  const isTransitioning = time >= baseSentence.end - transitionDur && nextBaseSentence !== null;
  const sameComponent =
    isTransitioning && nextBaseSentence &&
    getSceneKey(baseSentence.key) === getSceneKey(nextBaseSentence.key);

  // ── CURRENT BASE SCENE ──
  const currentOpacity = sameComponent
    ? 1
    : isTransitioning
      ? interpolate(
          time,
          [baseSentence.end - transitionDur, sceneVisualEnd],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) }
        )
      : 1;

  const currentX = !sameComponent && isTransitioning
    ? interpolate(
        time,
        [baseSentence.end - transitionDur, sceneVisualEnd],
        [0, -80],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) }
      )
    : 0;

  // ── NEXT BASE SCENE ──
  const nextOpacity = !sameComponent && isTransitioning
    ? interpolate(
        time,
        [baseSentence.end - transitionDur, sceneVisualEnd],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
      )
    : 0;

  const nextX = !sameComponent && isTransitioning
    ? interpolate(
        time,
        [baseSentence.end - transitionDur, sceneVisualEnd],
        [120, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
      )
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        width: WIDTH,
        height: HEIGHT,
        overflow: 'hidden',
      }}
    >
      {/* CURRENT BASE SCENE */}
      {currentOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateX(${currentX}px)`,
            opacity: currentOpacity,
          }}
        >
          <SceneRenderer time={time} sentence={baseSentence} />
        </div>
      )}

      {/* NEXT BASE SCENE */}
      {nextBaseSentence && !sameComponent && nextOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateX(${nextX}px)`,
            opacity: nextOpacity,
            pointerEvents: 'none',
          }}
        >
          <SceneRenderer time={nextBaseSentence.start} sentence={nextBaseSentence} />
        </div>
      )}

      {/* OVERLAY TEXT */}
      {activeOverlay && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 25 }}>
          <TextBridge
            text={activeOverlay.text}
            time={time}
            startTime={activeOverlay.start}
            endTime={activeOverlay.end}
            bridgeUntil={nextBaseSentence ? nextBaseSentence.start : undefined}
          />
        </div>
      )}

      {/* Global subtitle */}
      {currentSentence && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
          <SubtitleBar
            text={currentSentence.text}
            time={time}
            startTime={currentSentence.start}
            endTime={currentSentence.end}
          />
        </div>
      )}

      {/* Ambient particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4 }}>
        <FloatingParticles count={6} color="#E2E8F0" />
      </div>

      {/* Audio */}
      <Audio src={staticFile('narrator_v3.mp3')} />
    </AbsoluteFill>
  );
};
