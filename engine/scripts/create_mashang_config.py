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
    speed_factor = 1.38
    alignment_file = 'public/mashang_voice_single_pass_alignment.json'
    audio_file = 'public/mashang_voice_single_pass_fast.mp3'
    output_dir = '../content/13_etymology_mashang'
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
    for i, wa in enumerate(raw_words_alignment):
        start_sec = wa['start'] / speed_factor
        end_sec = wa['end'] / speed_factor
        words_alignment.append({
            "idx": i,
            "word": wa['word'],
            "start": round(start_sec, 3),
            "end": round(end_sec, 3),
            "startFrame": sec_to_frame(start_sec),
            "endFrame": sec_to_frame(end_sec)
        })

    audio_duration = get_audio_duration(audio_file)
    total_frames = sec_to_frame(audio_duration)

    print(f"Total Audio Duration: {audio_duration:.2f}s ({total_frames} frames)")
    print("\n--- Word Alignment List ---")
    for wa in words_alignment:
        print(f"{wa['idx']:02d}: '{wa['word']}' [{wa['startFrame']} - {wa['endFrame']}] ({wa['start']:.2f}s - {wa['end']:.2f}s)")

    # Find key transition timestamps
    first_char_idx = next(i for i, w in enumerate(words_alignment) if 'first' in w['word'].lower() or 'character' in w['word'].lower() and i > 5)
    second_char_idx = next(i for i, w in enumerate(words_alignment) if 'second' in w['word'].lower())
    synthesis_idx = next(i for i, w in enumerate(words_alignment) if 'ancient' in w['word'].lower() or 'imperial' in w['word'].lower() or 'fastest' in w['word'].lower())

    screen1_end = words_alignment[first_char_idx]['startFrame']
    screen2_end = words_alignment[second_char_idx]['startFrame']
    screen3_end = words_alignment[synthesis_idx]['startFrame']

    # Character 1: 马 (mǎ)
    # Mane: "flowing mane"
    # Hooves: "galloping hooves"
    mane_idx = next((i for i, w in enumerate(words_alignment) if 'mane' in w['word'].lower()), first_char_idx + 4)
    hooves_idx = next((i for i, w in enumerate(words_alignment) if 'hooves' in w['word'].lower() or 'galloping' in w['word'].lower()), mane_idx + 3)

    # Character 2: 上 (shàng)
    # Baseline: "baseline"
    # Upwards: "upwards" / "mount"
    baseline_idx = next((i for i, w in enumerate(words_alignment) if 'baseline' in w['word'].lower()), second_char_idx + 3)
    upward_idx = next((i for i, w in enumerate(words_alignment) if 'upwards' in w['word'].lower() or 'pointing' in w['word'].lower()), baseline_idx + 3)
    mount_idx = next((i for i, w in enumerate(words_alignment) if 'mount' in w['word'].lower() or 'top' in w['word'].lower()), upward_idx + 3)

    config_data = {
        "character": "马上",
        "pinyin": "mǎ shàng",
        "tone": 3,
        "meaning": "Immediately / Right Away",
        "story": "In ancient China, the most urgent imperial dispatches were carried by couriers on horseback (马上). So 'on a horse' became the universal expression for doing something right away!",
        "exampleSentence": {
            "cn": "我马上就到！",
            "pinyin": "wǒ mǎshàng jiù dào!",
            "en": "I'll be there right away!",
            "highlightWord": "马上"
        },
        "radicals": [
            {
                "radical": "马",
                "pinyin": "mǎ",
                "meaning": "Horse",
                "role": "semantic"
            },
            {
                "radical": "上",
                "pinyin": "shàng",
                "meaning": "On top / Above / To mount",
                "role": "semantic"
            }
        ],
        "audioSrc": "mashang_voice_single_pass_fast.mp3",
        "bgmAudioSrc": "chinese_lofi_bgm.mp3",
        "lessonDurationInFrames": total_frames,
        "screenTimestamps": {
            "screen1EndSec": round(screen1_end / 60.0, 3),
            "screen1EndFrame": screen1_end,
            "screen2EndSec": round(screen2_end / 60.0, 3),
            "screen2EndFrame": screen2_end,
            "screen3EndSec": round(screen3_end / 60.0, 3),
            "screen3EndFrame": screen3_end,
            "lessonTotalSec": round(audio_duration, 3),
            "lessonTotalFrames": total_frames
        },
        "animationTimestamps": {
            "screen1": {
                "startFrame": 0,
                "endFrame": screen1_end,
                "clothMention": {
                    "startFrame": words_alignment[0]['startFrame'],
                    "endFrame": words_alignment[min(10, len(words_alignment)-1)]['endFrame']
                },
                "wallMention": {
                    "startFrame": words_alignment[min(11, len(words_alignment)-1)]['startFrame'],
                    "endFrame": screen1_end
                }
            },
            "screen2": {
                "startFrame": screen1_end,
                "endFrame": screen2_end,
                "topBang": {
                    "startFrame": screen1_end,
                    "endFrame": words_alignment[hooves_idx]['startFrame']
                },
                "bottomJin": {
                    "startFrame": words_alignment[hooves_idx]['startFrame'],
                    "endFrame": screen2_end - 30
                },
                "wholeBang": {
                    "startFrame": screen2_end - 30,
                    "endFrame": screen2_end
                }
            },
            "screen3": {
                "startFrame": screen2_end,
                "endFrame": screen3_end,
                "wholeZhuIntro": {
                    "startFrame": screen2_end,
                    "endFrame": words_alignment[baseline_idx]['startFrame']
                },
                "leftQie": {
                    "startFrame": words_alignment[baseline_idx]['startFrame'],
                    "endFrame": words_alignment[upward_idx]['startFrame']
                },
                "rightLi": {
                    "startFrame": words_alignment[upward_idx]['startFrame'],
                    "endFrame": screen3_end - 30
                },
                "wholeZhuOutro": {
                    "startFrame": screen3_end - 30,
                    "endFrame": screen3_end
                }
            },
            "screen4": {
                "startFrame": screen3_end,
                "endFrame": total_frames,
                "bangHighlightEndFrame": screen3_end + int((total_frames - screen3_end) * 0.5)
            }
        },
        "wordsAlignment": words_alignment
    }

    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(config_data, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Created config at: {config_file}")

if __name__ == '__main__':
    main()
