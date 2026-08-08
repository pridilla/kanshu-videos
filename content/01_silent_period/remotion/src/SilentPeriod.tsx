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
import { HookScene, Trans1Scene } from './scenes/Scene1_Hook';
import { KrashenScene } from './scenes/Scene2_Krashen';
import { SilentPeriodScene, NoSpeakScene, InputScene, TwoThingsScene } from './scenes/Scene3_SilentPeriod';
import { OneScene, AffectiveScene, BrainBadScene, SolutionScene, ALotScene } from './scenes/Scene4_Problems';
import {
  ActionCardsScene,
  PatternScene,
  EmergeScene,
  NoForceScene,
  GuiltScene,
  BeTrueScene,
  ReadyScene,
} from './scenes/Scene5_ActionToEnd';

// ────────────────────────────────────────────────────────────
// SCENE DISPATCHER
// Returns the scene component key for transition detection
// ────────────────────────────────────────────────────────────

const getSceneKey = (sentenceKey: string): string => {
  switch (sentenceKey) {
    case 'hook':
      return 'HookScene';
    case 'trans1':
      return 'Trans1Scene';
    case 'krashen':
      return 'KrashenScene';
    case 'silent':
      return 'SilentPeriodScene';
    case 'nospeak':
      return 'NoSpeakScene';
    case 'input':
      return 'InputScene';
    case 'two':
      return 'TwoThingsScene';
    case 'one':
      return 'OneScene';
    case 'two_prob':
      return 'AffectiveScene';
    case 'brainbad':
      return 'BrainBadScene';
    case 'sol':
      return 'SolutionScene';
    case 'lot':
      return 'ALotScene';
    case 'watch':
    case 'listenp':
    case 'read':
      return 'ActionCardsScene';
    case 'pattern':
      return 'PatternScene';
    case 'emerge':
      return 'EmergeScene';
    case 'noforce':
    case 'comes':
      return 'NoForceScene';
    case 'guilt':
      return 'GuiltScene';
    case 'betrue':
      return 'BeTrueScene';
    case 'ready':
      return 'ReadyScene';
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
    case 'hook':
      return <HookScene time={time} progress={progress} />;
    case 'trans1':
      return <Trans1Scene time={time} progress={progress} />;
    case 'krashen':
      return <KrashenScene time={time} progress={progress} />;
    case 'silent':
      return <SilentPeriodScene time={time} progress={progress} />;
    case 'nospeak':
      return <NoSpeakScene time={time} progress={progress} />;
    case 'input':
      return <InputScene time={time} progress={progress} />;
    case 'two':
      return <TwoThingsScene time={time} progress={progress} />;
    case 'one':
      return <OneScene time={time} progress={progress} />;
    case 'two_prob':
      return <AffectiveScene time={time} progress={progress} />;
    case 'brainbad':
      return <BrainBadScene time={time} progress={progress} />;
    case 'sol':
      return <SolutionScene time={time} progress={progress} />;
    case 'lot':
      return <ALotScene time={time} progress={progress} />;
    case 'watch':
    case 'listenp':
    case 'read':
      return <ActionCardsScene time={time} progress={progress} cardKey={key} />;
    case 'pattern':
      return <PatternScene time={time} progress={progress} />;
    case 'emerge':
      return <EmergeScene time={time} progress={progress} />;
    case 'noforce':
    case 'comes':
      return <NoForceScene time={time} progress={progress} cardKey={key} />;
    case 'guilt':
      return <GuiltScene time={time} progress={progress} />;
    case 'betrue':
      return <BeTrueScene time={time} progress={progress} />;
    case 'ready':
      return <ReadyScene time={time} progress={progress} />;
    default:
      return <FloatingParticles count={8} />;
  }
};

// ────────────────────────────────────────────────────────────
// OVERLAY-AWARE SCENE SYSTEM
//
// Short sentences (trans1, nospeak, lot, betrue) don't get their own scene.
// Instead, their text appears as an overlay on the PREVIOUS scene.
// The base scene stays active until the NEXT non-overlay sentence starts.
//
// Cross-segment transitions still use gap-bridged slide/fade.
// Same-component transitions still skip the slide.
// ────────────────────────────────────────────────────────────

export const SilentPeriod: React.FC = () => {
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

  // Also keep overlay text visible during the gap after it ends,
  // until the next base scene starts.
  const pendingOverlay = !overlaySentence && currentIdx >= 0 && currentSentence
    ? null
    : (() => {
        // Check if we're in a gap and the previous sentence was an overlay
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

  // ── TRANSITION MATH (based on base scenes, not overlays) ──
  const transitionDur = TRANSITION_DURATION;

  // Visual end of current base scene = when next base scene starts
  const sceneVisualEnd = nextBaseSentence ? nextBaseSentence.start : baseSentence.end;

  // Transition window: from base scene's audio-end minus buffer, to next base start
  const isTransitioning = time >= baseSentence.end - transitionDur && nextBaseSentence !== null;

  // Same component = continuous scenes that should not fade/slide over each other
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

  // ── NEXT BASE SCENE (distinct components only) ──
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

      {/* NEXT BASE SCENE — distinct components only */}
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

      {/* OVERLAY TEXT — appears ON the base scene */}
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

      {/* Global subtitle — strict audio timing */}
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

      {/* Global ambient particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4 }}>
        <FloatingParticles count={6} color="#E2E8F0" />
      </div>

      {/* Audio track */}
      <Audio src={staticFile('narrator_fast.mp3')} />
    </AbsoluteFill>
  );
};
