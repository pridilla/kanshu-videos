#!/usr/bin/env python3
"""
Sync Single-Pass Alignment & Centralized Animation Timeline to Config (v6 - Speed Multiplier Support)
-----------------------------------------------------------------------------------------------------
Parses character-level timestamps into `wordsAlignment`, applies optional speed multiplier (e.g. 1.15x),
and sequentially maps all animation frame boundaries into `animationTimestamps` in `config.json`.
"""

import os
import sys
import json
import argparse
import subprocess

def get_audio_duration(file_path):
    cmd = [
        'ffprobe', '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        file_path
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    try:
        return float(res.stdout.strip())
    except ValueError:
        return 0.0

def sec_to_frame(sec, fps=60):
    return int(round(sec * fps))

def main():
    parser = argparse.ArgumentParser(description="Sync single-pass alignment with config.json and optional speed factor")
    parser.add_argument('--speed', type=float, default=1.15, help="Speed multiplier applied to audio (e.g. 1.15 for 15%% faster)")
    parser.add_argument('--audio', default='/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/bangzhu_voice_single_pass_fast.mp3')
    parser.add_argument('--config', default='/Users/peterridilla/Documents/fun/kanshu/videos/content/04_etymology_bangzhu/config.json')
    parser.add_argument('--alignment', default='/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/bangzhu_voice_single_pass_alignment.json')
    args = parser.parse_args()

    speed_factor = args.speed
    alignment_path = args.alignment
    config_path = args.config
    audio_path = args.audio

    with open(alignment_path, 'r') as f:
        align = json.load(f)

    chars = align.get('characters', [])
    starts = align.get('character_start_times_seconds', [])
    ends = align.get('character_end_times_seconds', [])

    raw_words_alignment = []
    current_word_chars = []
    word_start = None
    word_end = None

    for c, s, e in zip(chars, starts, ends):
        if c in [' ', '\n', '\t']:
            if current_word_chars:
                w_str = ''.join(current_word_chars).strip()
                if w_str:
                    raw_words_alignment.append({
                        "word": w_str,
                        "start": word_start,
                        "end": word_end
                    })
                current_word_chars = []
                word_start = None
                word_end = None
        else:
            if word_start is None:
                word_start = s
            word_end = e
            current_word_chars.append(c)

    if current_word_chars:
        w_str = ''.join(current_word_chars).strip()
        if w_str:
            raw_words_alignment.append({
                "word": w_str,
                "start": word_start,
                "end": word_end
            })

    # Apply speed factor (scale timestamps by 1 / speed_factor)
    words_alignment = []
    for wa in raw_words_alignment:
        scaled_s = round(wa['start'] / speed_factor, 3)
        scaled_e = round(wa['end'] / speed_factor, 3)
        words_alignment.append({
            "word": wa['word'],
            "start": scaled_s,
            "end": scaled_e
        })

    # Sequential search for scaled timestamps
    screen1_end_sec = 9.74 / speed_factor
    screen2_end_sec = 33.80 / speed_factor
    screen3_end_sec = 55.96 / speed_factor

    cloth_s, cloth_e = 3.947 / speed_factor, 4.56 / speed_factor
    wall_s, wall_e = 5.472 / speed_factor, 6.32 / speed_factor
    altar_s, altar_e = 6.52 / speed_factor, 7.20 / speed_factor
    muscle_s, muscle_e = 8.25 / speed_factor, 9.04 / speed_factor

    jin_start_sec = 18.24 / speed_factor
    bang_summary_sec = 27.60 / speed_factor

    qie_start_sec = 37.60 / speed_factor
    li_start_sec = 42.80 / speed_factor
    zhu_summary_sec = 50.32 / speed_factor
    synthesis_zhu_sec = 60.56 / speed_factor

    for wa in words_alignment:
        w = wa['word']
        st = wa['start']
        ed = wa['end']

        if "Let's" in w:
            screen1_end_sec = st
        elif "Now" in w and st > (20 / speed_factor):
            screen2_end_sec = st
        elif "Put" in w and st > (45 / speed_factor):
            screen3_end_sec = st

        # Intro mentions
        elif "cloth," in w and st < (10 / speed_factor):
            cloth_s, cloth_e = st, ed
        elif "wall," in w and st < (10 / speed_factor):
            wall_s, wall_e = st, ed
        elif "altar," in w and st < (10 / speed_factor):
            altar_s, altar_e = st, ed
        elif "muscles?" in w and st < (10 / speed_factor):
            muscle_s, muscle_e = st, ed

        # Screen 2 breakdown
        elif "巾" in w and (12 / speed_factor) < st < (25 / speed_factor):
            jin_start_sec = st
        elif "帮" in w and (25 / speed_factor) < st < (33 / speed_factor):
            bang_summary_sec = st

        # Screen 3 breakdown
        elif "且" in w and (35 / speed_factor) < st < (45 / speed_factor):
            qie_start_sec = st
        elif "力" in w and (40 / speed_factor) < st < (48 / speed_factor):
            li_start_sec = st
        elif "助" in w and (48 / speed_factor) < st < (55 / speed_factor):
            zhu_summary_sec = st

        # Screen 4 synthesis
        elif "助" in w and st > (55 / speed_factor):
            synthesis_zhu_sec = st

    audio_duration = get_audio_duration(audio_path)
    total_frames = sec_to_frame(audio_duration)

    animation_timestamps = {
        "screen1": {
            "startFrame": 0,
            "endFrame": sec_to_frame(screen1_end_sec),
            "clothMention": {
                "startSec": round(cloth_s, 3),
                "endSec": round(cloth_e, 3),
                "startFrame": sec_to_frame(cloth_s),
                "endFrame": sec_to_frame(cloth_e)
            },
            "wallMention": {
                "startSec": round(wall_s, 3),
                "endSec": round(wall_e, 3),
                "startFrame": sec_to_frame(wall_s),
                "endFrame": sec_to_frame(wall_e)
            },
            "altarMention": {
                "startSec": round(altar_s, 3),
                "endSec": round(altar_e, 3),
                "startFrame": sec_to_frame(altar_s),
                "endFrame": sec_to_frame(altar_e)
            },
            "muscleMention": {
                "startSec": round(muscle_s, 3),
                "endSec": round(muscle_e, 3),
                "startFrame": sec_to_frame(muscle_s),
                "endFrame": sec_to_frame(muscle_e)
            }
        },
        "screen2": {
            "startFrame": sec_to_frame(screen1_end_sec),
            "endFrame": sec_to_frame(screen2_end_sec),
            "topBang": {
                "startFrame": sec_to_frame(screen1_end_sec),
                "endFrame": sec_to_frame(jin_start_sec)
            },
            "bottomJin": {
                "startFrame": sec_to_frame(jin_start_sec),
                "endFrame": sec_to_frame(bang_summary_sec)
            },
            "wholeBang": {
                "startFrame": sec_to_frame(bang_summary_sec),
                "endFrame": sec_to_frame(screen2_end_sec)
            }
        },
        "screen3": {
            "startFrame": sec_to_frame(screen2_end_sec),
            "endFrame": sec_to_frame(screen3_end_sec),
            "wholeZhuIntro": {
                "startFrame": sec_to_frame(screen2_end_sec),
                "endFrame": sec_to_frame(qie_start_sec)
            },
            "leftQie": {
                "startFrame": sec_to_frame(qie_start_sec),
                "endFrame": sec_to_frame(li_start_sec)
            },
            "rightLi": {
                "startFrame": sec_to_frame(li_start_sec),
                "endFrame": sec_to_frame(zhu_summary_sec)
            },
            "wholeZhuOutro": {
                "startFrame": sec_to_frame(zhu_summary_sec),
                "endFrame": sec_to_frame(screen3_end_sec)
            }
        },
        "screen4": {
            "startFrame": sec_to_frame(screen3_end_sec),
            "endFrame": total_frames,
            "bangHighlightEndFrame": sec_to_frame(synthesis_zhu_sec)
        }
    }

    screen_timestamps = {
        "screen1EndSec": round(screen1_end_sec, 3),
        "screen1EndFrame": sec_to_frame(screen1_end_sec),
        "screen2EndSec": round(screen2_end_sec, 3),
        "screen2EndFrame": sec_to_frame(screen2_end_sec),
        "screen3EndSec": round(screen3_end_sec, 3),
        "screen3EndFrame": sec_to_frame(screen3_end_sec),
        "lessonTotalSec": round(audio_duration, 3),
        "lessonTotalFrames": total_frames
    }

    print(f"\nCalculated Centralized Animation Timestamps (v6 - Speed Multiplier {speed_factor}x):")
    print(json.dumps(animation_timestamps, indent=2))

    with open(config_path, 'r') as f:
        cfg = json.load(f)

    audio_filename = os.path.basename(audio_path)
    cfg['audioSrc'] = audio_filename
    cfg['wordsAlignment'] = words_alignment
    cfg['screenTimestamps'] = screen_timestamps
    cfg['animationTimestamps'] = animation_timestamps
    cfg['lessonDurationInFrames'] = total_frames

    with open(config_path, 'w') as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Successfully updated {config_path} with {audio_filename} & {speed_factor}x speed alignment!")

if __name__ == '__main__':
    main()
