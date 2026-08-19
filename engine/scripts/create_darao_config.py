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
    alignment_file = 'engine/public/darao_voice_single_pass_alignment.json'
    audio_file = 'engine/public/darao_voice_single_pass_fast.mp3'
    output_dir = 'content/12_etymology_darao'
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
    # S1 Hook: 0 -> Look at 打 (dǎ)
    # S2 Char 1 (打): Look at 打 -> Now look at 扰 (rǎo)
    # S3 Char 2 (扰): Now look at 扰 -> Put them together
    # S4 Synthesis: Put them together -> end

    look_da_idx = next(i for i, w in enumerate(words_alignment) if 'Look' in w['word'])
    now_rao_idx = next(i for i, w in enumerate(words_alignment) if 'Now' in w['word'])
    put_together_idx = next(i for i, w in enumerate(words_alignment) if 'Put' in w['word'])

    screen1_end = words_alignment[look_da_idx]['startFrame']
    screen2_end = words_alignment[now_rao_idx]['startFrame']
    screen3_end = words_alignment[put_together_idx]['startFrame']

    # Radical timestamps in Scene 2 (打: 扌 left, 丁 right, 打 whole)
    # "On the left is 扌 (shǒu)"
    shou_da_idx = next(i for i, w in enumerate(words_alignment) if '扌' in w['word'] and i < now_rao_idx)
    # "On the right is 丁 (dīng)"
    ding_idx = next(i for i, w in enumerate(words_alignment) if '丁' in w['word'])
    # "Together, it means"
    together_da_idx = next(i for i, w in enumerate(words_alignment) if 'Together' in w['word'] and i < now_rao_idx)

    # Radical timestamps in Scene 3 (扰: 扌 left, 尤 right, 扰 whole)
    # "On the left is 扌 (shǒu)"
    shou_rao_idx = next(i for i, w in enumerate(words_alignment) if '扌' in w['word'] and i > now_rao_idx)
    # "On the right is 尤 (yóu)"
    you_idx = next(i for i, w in enumerate(words_alignment) if '尤' in w['word'])
    # "It originally pictured"
    originally_idx = next(i for i, w in enumerate(words_alignment) if 'originally' in w['word'])

    # S1 Hook sub-phases:
    # "hitting monkeys"
    hitting_idx = next(i for i, w in enumerate(words_alignment) if 'hitting' in w['word'])
    monkeys_idx = next(i for i, w in enumerate(words_alignment) if 'monkeys' in w['word'] and i < look_da_idx)
    # "But why?"
    why_idx = next(i for i, w in enumerate(words_alignment) if 'why' in w['word'])

    cfg = {
        "character": "打扰",
        "pinyin": "dǎ rǎo",
        "tone": 3,
        "meaning": "To Disturb / Excuse Me",
        "audioSrc": "darao_voice_single_pass_fast.mp3",
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
                    "startFrame": words_alignment[hitting_idx]['startFrame'],
                    "endFrame": words_alignment[monkeys_idx]['endFrame']
                },
                "whyMention": {
                    "startFrame": words_alignment[why_idx]['startFrame'] - 10,
                    "endFrame": screen1_end
                }
            },
            "screen2": {
                "startFrame": screen1_end,
                "endFrame": screen2_end,
                "topBang": {
                    "startFrame": screen1_end,
                    "endFrame": words_alignment[ding_idx]['startFrame']
                },
                "bottomJin": {
                    "startFrame": words_alignment[ding_idx]['startFrame'],
                    "endFrame": words_alignment[together_da_idx]['startFrame']
                },
                "wholeBang": {
                    "startFrame": words_alignment[together_da_idx]['startFrame'],
                    "endFrame": screen2_end
                }
            },
            "screen3": {
                "startFrame": screen2_end,
                "endFrame": screen3_end,
                "wholeZhuIntro": {
                    "startFrame": screen2_end,
                    "endFrame": words_alignment[shou_rao_idx]['startFrame']
                },
                "leftQie": {
                    "startFrame": screen2_end,
                    "endFrame": words_alignment[you_idx]['startFrame']
                },
                "rightLi": {
                    "startFrame": words_alignment[you_idx]['startFrame'],
                    "endFrame": words_alignment[originally_idx]['startFrame']
                },
                "wholeZhuOutro": {
                    "startFrame": words_alignment[originally_idx]['startFrame'],
                    "endFrame": screen3_end
                }
            },
            "screen4": {
                "startFrame": screen3_end,
                "endFrame": total_frames,
                "bangHighlightEndFrame": screen3_end + int((total_frames - screen3_end) * 0.5)
            }
        }
    }

    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Created config at {config_file}")
    print(f"Screen 1 (Hook): 0 -> {screen1_end} ({screen1_end/60:.2f}s)")
    print(f"Screen 2 (打): {screen1_end} -> {screen2_end} ({(screen2_end-screen1_end)/60:.2f}s)")
    print(f"  - 扌 (hand): {screen1_end} -> {words_alignment[ding_idx]['startFrame']}")
    print(f"  - 丁 (nail): {words_alignment[ding_idx]['startFrame']} -> {words_alignment[together_da_idx]['startFrame']}")
    print(f"  - 打 (strike): {words_alignment[together_da_idx]['startFrame']} -> {screen2_end}")
    print(f"Screen 3 (扰): {screen2_end} -> {screen3_end} ({(screen3_end-screen2_end)/60:.2f}s)")
    print(f"  - 扌 (hand): {screen2_end} -> {words_alignment[you_idx]['startFrame']}")
    print(f"  - 尤 (monkey): {words_alignment[you_idx]['startFrame']} -> {words_alignment[originally_idx]['startFrame']}")
    print(f"  - 扰 (monkey chaos): {words_alignment[originally_idx]['startFrame']} -> {screen3_end}")
    print(f"Screen 4 (Synthesis): {screen3_end} -> {total_frames} ({(total_frames-screen3_end)/60:.2f}s)")

if __name__ == '__main__':
    main()
