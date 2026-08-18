import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface AlignedWord {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
}

export interface RealtimeCaptionsProps {
  words: AlignedWord[];
  positionBottom?: number;
}

export const RealtimeCaptions: React.FC<RealtimeCaptionsProps> = ({ words, positionBottom = 440 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Group words into distinct phrase sentences
  const phrases = React.useMemo(() => {
    if (!words || words.length === 0) return [];
    
    const grouped: AlignedWord[][] = [];
    let currentGroup: AlignedWord[] = [];

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      currentGroup.push(w);

      const hasPunctuation = /[.?!]$/.test(w.word);
      const isNextGapLarge = i < words.length - 1 && (words[i + 1].start - w.end > 0.35);

      if (hasPunctuation || isNextGapLarge || currentGroup.length >= 7) {
        grouped.push(currentGroup);
        currentGroup = [];
      }
    }
    if (currentGroup.length > 0) {
      grouped.push(currentGroup);
    }
    return grouped;
  }, [words]);

  // Find currently active phrase group
  const activeGroup = phrases.find(group => {
    if (group.length === 0) return false;
    const groupStart = group[0].start;
    const groupEnd = group[group.length - 1].end + 0.15;
    return currentTime >= groupStart && currentTime <= groupEnd;
  });

  // HIDE CAPTIONS COMPLETELY BETWEEN SENTENCES!
  if (!activeGroup || activeGroup.length === 0) {
    return null;
  }

  // Find currently active word index within activeGroup
  // Ensures ALWAYS AT LEAST ONE WORD IS HIGHLIGHTED while activeGroup is visible!
  let activeWordInGroupIdx = 0;
  for (let i = 0; i < activeGroup.length; i++) {
    const w = activeGroup[i];
    const nextStart = i < activeGroup.length - 1 ? activeGroup[i + 1].start : w.end + 0.3;
    if (currentTime >= w.start) {
      if (currentTime < nextStart || i === activeGroup.length - 1) {
        activeWordInGroupIdx = i;
        break;
      }
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: positionBottom,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: 980,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px 14px',
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'blur(20px)',
        padding: '20px 32px',
        borderRadius: 28,
        border: '2px solid rgba(255, 111, 89, 0.4)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {activeGroup.map((item, idx) => {
        const isActive = idx === activeWordInGroupIdx;

        return (
          <span
            key={idx}
            style={{
              fontSize: 42,
              fontWeight: 800,
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              color: isActive ? '#FF6F59' : '#FFFFFF',
              backgroundColor: isActive ? 'rgba(255, 111, 89, 0.25)' : 'transparent',
              padding: '6px 12px',
              borderRadius: 12,
              textShadow: isActive ? '0 4px 16px rgba(255, 111, 89, 0.75)' : 'none',
              display: 'inline-block',
              transition: 'color 0.05s linear, background-color 0.05s linear',
            }}
          >
            {item.word.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};
