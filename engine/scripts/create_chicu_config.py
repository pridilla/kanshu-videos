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

    print(f"Total words: {len(words_alignment)}, Duration: {audio_duration:.2f}s ({total_frames} frames)")
    for i, w in enumerate(words_alignment):
        print(f"{i:02d}: '{w['word']}' [{w['startFrame']} - {w['endFrame']}] ({w['start']:.2f}s - {w['end']:.2f}s)")

    # Find key phrase boundaries
    # Words in transcript:
    # 0: Jealous
    # 1: in
    # 2: Chinese
    # 3: is
    # 4: 吃醋
    # 5: (chīcù).
    # 6: It
    # 7: literally
    # 8: means
    # 9: eating
    # 10: vinegar.
    # 11: But
    # 12: why?
    # 13: Look
    # 14: at
    # 15: 吃
    # 16: (chī).
    # 17: On
    # 18: the
    # 19: left
    # 20: is
    # 21: 口
    # 22: (kǒu),
    # 23: a
    # 24: mouth.
    # 25: On
    # 26: the
    # 27: right
    # 28: is
    # 29: 乞
    # 30: (qǐ),
    # 31: begging
    # 32: for
    # 33: food.
    # 34: Together,
    # 35: it
    # 36: means
    # 37: swallowing
    # 38: food!
    # 39: Now
    # 40: look
    # 41: at
    # 42: 醋
    # 43: (cù).
    # ...

    # Let's dynamically identify indices
    def find_idx(target_word, start_from=0):
        for idx in range(start_from, len(words_alignment)):
            if target_word.lower() in words_alignment[idx]['word'].lower():
                return idx
        return -1

    why_idx = find_idx("why")
    screen1_end = words_alignment[why_idx]['endFrame'] if why_idx != -1 else 156

    now_look_idx = find_idx("now", start_from=why_idx+1)
    screen2_end = words_alignment[now_look_idx]['startFrame'] if now_look_idx != -1 else 600

    emperor_idx = find_idx("emperor", start_from=now_look_idx+1)
    if emperor_idx == -1:
        emperor_idx = find_idx("tested", start_from=now_look_idx+1)
    if emperor_idx == -1:
        emperor_idx = find_idx("when", start_from=now_look_idx+1)
    screen3_end = words_alignment[emperor_idx]['startFrame'] if emperor_idx != -1 else 1200

    # Screen 1 mentions
    eating_idx = find_idx("eating")
    vinegar_idx = find_idx("vinegar")

    # Screen 2 sub-parts: 口 (mouth) and 乞 (begging) and whole 吃
    kou_idx = find_idx("口")
    qi_idx = find_idx("乞")
    together1_idx = find_idx("together", start_from=why_idx+1)

    # Screen 3 sub-parts: 酉 (wine jar) and 昔 (past) and whole 醋
    you_idx = find_idx("酉")
    xi_idx = find_idx("昔")
    wine_idx = find_idx("wine", start_from=now_look_idx+1)

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
                    "startFrame": words_alignment[eating_idx]['startFrame'] if eating_idx != -1 else 50,
                    "endFrame": words_alignment[eating_idx]['endFrame'] if eating_idx != -1 else 75
                },
                "wallMention": {
                    "startFrame": words_alignment[vinegar_idx]['startFrame'] if vinegar_idx != -1 else 75,
                    "endFrame": words_alignment[vinegar_idx]['endFrame'] if vinegar_idx != -1 else 105
                },
                "whyMention": {
                    "startFrame": words_alignment[why_idx]['startFrame'] if why_idx != -1 else 115,
                    "endFrame": words_alignment[why_idx]['endFrame'] if why_idx != -1 else 156
                }
            },
            "screen2": {
                "startFrame": screen1_end,
                "endFrame": screen2_end,
                "topBang": {
                    "startFrame": screen1_end,
                    "endFrame": words_alignment[qi_idx]['startFrame'] if qi_idx != -1 else (screen1_end + 180)
                },
                "bottomJin": {
                    "startFrame": words_alignment[qi_idx]['startFrame'] if qi_idx != -1 else (screen1_end + 180),
                    "endFrame": words_alignment[together1_idx]['startFrame'] if together1_idx != -1 else (screen1_end + 320)
                },
                "wholeBang": {
                    "startFrame": words_alignment[together1_idx]['startFrame'] if together1_idx != -1 else (screen1_end + 320),
                    "endFrame": screen2_end
                }
            },
            "screen3": {
                "startFrame": screen2_end,
                "endFrame": screen3_end,
                "wholeZhuIntro": {
                    "startFrame": screen2_end,
                    "endFrame": words_alignment[you_idx]['startFrame'] if you_idx != -1 else (screen2_end + 80)
                },
                "leftQie": {
                    "startFrame": words_alignment[you_idx]['startFrame'] if you_idx != -1 else (screen2_end + 80),
                    "endFrame": words_alignment[xi_idx]['startFrame'] if xi_idx != -1 else (screen2_end + 200)
                },
                "rightLi": {
                    "startFrame": words_alignment[xi_idx]['startFrame'] if xi_idx != -1 else (screen2_end + 200),
                    "endFrame": words_alignment[wine_idx]['startFrame'] if wine_idx != -1 else (screen2_end + 340)
                },
                "wholeZhuOutro": {
                    "startFrame": words_alignment[wine_idx]['startFrame'] if wine_idx != -1 else (screen2_end + 340),
                    "endFrame": screen3_end
                }
            },
            "screen4": {
                "startFrame": screen3_end,
                "endFrame": total_frames,
                "bangHighlightEndFrame": screen3_end + int((total_frames - screen3_end) * 0.6)
            }
        }
    }

    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Created config at {config_file}")
    print(f"Screen 1: 0 -> {screen1_end}")
    print(f"Screen 2: {screen1_end} -> {screen2_end}")
    print(f"Screen 3: {screen2_end} -> {screen3_end}")
    print(f"Screen 4: {screen3_end} -> {total_frames}")

if __name__ == '__main__':
    main()
