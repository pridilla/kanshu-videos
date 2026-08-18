#!/usr/bin/env python3
import os
import json
import subprocess

def get_audio_duration(file_path):
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file_path]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    try:
        return float(res.stdout.strip())
    except ValueError:
        return 0.0

def sec_to_frame(sec, fps=60):
    return int(round(sec * fps))

def main():
    speed_factor = 1.35
    alignment_file = 'engine/public/chicu_voice_single_pass_alignment.json'
    audio_file = 'engine/public/chicu_voice_single_pass_fast.mp3'
    output_dir = 'content/11_etymology_chicu'
    config_file = os.path.join(output_dir, 'config.json')

    os.makedirs(output_dir, exist_ok=True)

    with open(alignment_file, 'r') as f:
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
                    raw_words_alignment.append({"word": w_str, "start": word_start, "end": word_end})
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
            raw_words_alignment.append({"word": w_str, "start": word_start, "end": word_end})

    words_alignment = []
    for wa in raw_words_alignment:
        words_alignment.append({
            "word": wa['word'],
            "start": round(wa['start'] / speed_factor, 3),
            "end": round(wa['end'] / speed_factor, 3),
            "startFrame": sec_to_frame(wa['start'] / speed_factor),
            "endFrame": sec_to_frame(wa['end'] / speed_factor)
        })

    audio_duration = get_audio_duration(audio_file)
    total_frames = sec_to_frame(audio_duration)

    # Key word indices:
    # 0: Jealous [0 - 21]
    # 1: in [24 - 28]
    # 2: Chinese [32 - 57]
    # 3: is [63 - 75]
    # 4: 吃醋 [103 - 146]
    # 5: (chīcù). [155 - 166]
    # 6: It [167 - 167]
    # 7: literally [169 - 188]
    # 8: means [192 - 210]
    # 9: eating [213 - 231]
    # 10: vinegar. [235 - 263]
    # 11: But [271 - 295]
    # 12: why? [301 - 324]
    # 13: Look [331 - 363]
    # 21: 口 [484 - 485]
    # 29: 乞 [622 - 623]
    # 34: Together, [710 - 764]
    # 39: Now look at 醋 [880 - 992]
    # 48: 酉 (yǒu) [1042 - 1074]
    # 57: 昔 (xī) [1195 - 1216]
    # 61: Wine left in a jar [1279 - 1358]
    # 72: When an Emperor [1518 - 1575]

    screen1_end = 324
    screen2_end = 880
    screen3_end = 1518 # "When an Emperor" starts at 1518

    cfg = {
        "character": "吃醋",
        "pinyin": "chī cù",
        "tone": 1,
        "meaning": "To Be Jealous",
        "audioSrc": "chicu_voice_single_pass_fast.mp3",
        "bgmAudioSrc": "chinese_lofi_bgm.mp3",
        "lessonDurationInFrames": total_frames,
        "wordsAlignment": [{"word": wa['word'], "start": wa['start'], "end": wa['end']} for wa in words_alignment],
        "screenTimestamps": {
            "screen1EndFrame": screen1_end,
            "screen2EndFrame": screen2_end,
            "screen3EndFrame": screen3_end,
            "lessonTotalFrames": total_frames
        },
        "animationTimestamps": {
            "screen1": {
                "startFrame": 0,
                "endFrame": screen1_end,
                "clothMention": {
                    "startFrame": 213,
                    "endFrame": 231
                },
                "wallMention": {
                    "startFrame": 235,
                    "endFrame": 263
                },
                "whyMention": {
                    "startFrame": 271,
                    "endFrame": 324
                }
            },
            "screen2": {
                "startFrame": screen1_end,
                "endFrame": screen2_end,
                "topBang": {
                    "startFrame": screen1_end,
                    "endFrame": 622
                },
                "bottomJin": {
                    "startFrame": 622,
                    "endFrame": 710
                },
                "wholeBang": {
                    "startFrame": 710,
                    "endFrame": screen2_end
                }
            },
            "screen3": {
                "startFrame": screen2_end,
                "endFrame": screen3_end,
                "wholeZhuIntro": {
                    "startFrame": screen2_end,
                    "endFrame": 1042
                },
                "leftQie": {
                    "startFrame": 880,
                    "endFrame": 1195
                },
                "rightLi": {
                    "startFrame": 1195,
                    "endFrame": 1279
                },
                "wholeZhuOutro": {
                    "startFrame": 1279,
                    "endFrame": screen3_end
                }
            },
            "screen4": {
                "startFrame": screen3_end,
                "endFrame": total_frames,
                "bangHighlightEndFrame": 1995
            }
        }
    }

    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Cleanly updated config at {config_file}")
    print(f"Screen 1: 0 -> {screen1_end}")
    print(f"Screen 2: {screen1_end} -> {screen2_end}")
    print(f"Screen 3: {screen2_end} -> {screen3_end}")
    print(f"  - 酉 (jar): 880 -> 1195")
    print(f"  - 昔 (past): 1195 -> 1279")
    print(f"  - 醋 (sour): 1279 -> {screen3_end}")
    print(f"Screen 4: {screen3_end} -> {total_frames}")

if __name__ == '__main__':
    main()
