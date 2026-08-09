import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SPRING_OVERSHOOT } from '../shared/constants';

export interface AlignedWord {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
}

export interface RealtimeCaptionsProps {
  words: AlignedWord[];
  positionBottom?: number;
}

export const RealtimeCaptions: React.FC<RealtimeCaptionsProps> = ({ words, positionBottom = 160 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find currently active word index
  const activeWordIdx = words.findIndex(w => currentTime >= w.start && currentTime <= w.end);

  // Group words into 4 distinct phrases for clean subtitle pagination
  const phrases = React.useMemo(() => {
    if (!words || words.length === 0) return [];
    
    // Break into logical sentences/phrases based on timing gaps or punctuation
    const grouped: AlignedWord[][] = [];
    let currentGroup: AlignedWord[] = [];

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      currentGroup.push(w);

      const hasPunctuation = /[.?!]$/.test(w.word);
      const isNextGapLarge = i < words.length - 1 && (words[i + 1].start - w.end > 0.35);

      if (hasPunctuation || isNextGapLarge || currentGroup.length >= 8) {
        grouped.push(currentGroup);
        currentGroup = [];
      }
    }
    if (currentGroup.length > 0) {
      grouped.push(currentGroup);
    }
    return grouped;
  }, [words]);

  // Find which phrase group is currently active
  const activeGroup = phrases.find(group => {
    if (group.length === 0) return false;
    const groupStart = group[0].start - 0.2;
    const groupEnd = group[group.length - 1].end + 0.3;
    return currentTime >= groupStart && currentTime <= groupEnd;
  }) || phrases[0];

  if (!activeGroup || activeGroup.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: positionBottom,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: 960,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px 12px',
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(16px)',
        padding: '16px 28px',
        borderRadius: 24,
        border: '1.5px solid rgba(255, 111, 89, 0.35)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {activeGroup.map((item, idx) => {
        const isActive = currentTime >= item.start && currentTime <= item.end;
        const isPast = currentTime > item.end;

        return (
          <span
            key={idx}
            style={{
              fontSize: 32,
              fontWeight: isActive ? 900 : 700,
              fontFamily: 'Inter, sans-serif',
              color: isActive ? '#FF6F59' : isPast ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
              backgroundColor: isActive ? 'rgba(255, 111, 89, 0.22)' : 'transparent',
              padding: isActive ? '4px 12px' : '4px 2px',
              borderRadius: 12,
              transform: isActive ? 'scale(1.12)' : 'scale(1)',
              transition: 'all 0.08s ease-out',
              textShadow: isActive ? '0 4px 14px rgba(255, 111, 89, 0.6)' : 'none',
              display: 'inline-block',
            }}
          >
            {item.word}
          </span>
        );
      })}
    </div>
  );
};
