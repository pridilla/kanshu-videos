import json
import subprocess

def get_audio_duration(file_path):
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file_path]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return float(res.stdout.strip())

def sec_to_frame(sec, fps=60):
    return int(round(sec * fps))

speed_factor = 1.20
align_path = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/kaishi_voice_single_pass_alignment.json"
audio_path = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/kaishi_voice_single_pass_fast.mp3"
out_path = "/Users/peterridilla/Documents/fun/kanshu/videos/content/09_etymology_kaishi/config.json"

with open(align_path, 'r') as f:
    align = json.load(f)

chars = align.get('characters', [])
starts = align.get('character_start_times_seconds', [])
ends = align.get('character_end_times_seconds', [])

raw_words = []
current_chars = []
w_start = None
w_end = None

for c, s, e in zip(chars, starts, ends):
    if c in [' ', '\n', '\t']:
        if current_chars:
            w_str = ''.join(current_chars).strip()
            if w_str:
                raw_words.append({"word": w_str, "start": w_start, "end": w_end})
            current_chars = []
            w_start = None
            w_end = None
    else:
        if w_start is None:
            w_start = s
        w_end = e
        current_chars.append(c)

if current_chars:
    w_str = ''.join(current_chars).strip()
    if w_str:
        raw_words.append({"word": w_str, "start": w_start, "end": w_end})

words_alignment = [
    {
        "word": w["word"],
        "start": round(w["start"] / speed_factor, 3),
        "end": round(w["end"] / speed_factor, 3)
    }
    for w in raw_words
]

audio_dur = get_audio_duration(audio_path)
total_frames = sec_to_frame(audio_dur)

# Let's find exact word indexes:
# "gate" is word 7, "woman" is word 10, "birth" is word 12, "Let's" is word 13
# "gate," (end of bolt mention) is word 30, "path!" is word 42, "Now" is word 43
# "left," is word 51, "mother." is word 58, "right," is word 61, "sound." is word 66, "birth!" is word 79, "Put" is word 80
# "world—which" is word 97, "unlatching" is word 88

w_cloth = words_alignment[7] # gate
w_wall = words_alignment[10] # woman
w_altar = words_alignment[12] # birth
w_s1_end = words_alignment[13] # Let's

w_bolt_end = words_alignment[30] # gate,
w_s2_end = words_alignment[43] # Now

w_left_start = words_alignment[52] # 女
w_left_end = words_alignment[58] # mother.
w_right_start = words_alignment[62] # 台
w_right_end = words_alignment[66] # sound.
w_s3_end = words_alignment[80] # Put

w_highlight_switch = words_alignment[88] # unlatching

s1_end_frame = sec_to_frame(w_s1_end['start'])
s2_end_frame = sec_to_frame(w_s2_end['start'])
s3_end_frame = sec_to_frame(w_s3_end['start'])

top_bang_end_frame = sec_to_frame(w_bolt_end['end'])
left_qie_end_frame = sec_to_frame(w_left_end['end'])
right_li_end_frame = sec_to_frame(w_right_end['end'])
bang_highlight_end_frame = sec_to_frame(w_highlight_switch['start'])

config = {
    "character": "开始",
    "pinyin": "kāi shǐ",
    "tone": 1,
    "meaning": "To Start / Begin",
    "oracleBoneSymbol": "🚪🌱",
    "radicals": [
        {
            "radical": "开 (kāi)",
            "pinyin": "kāi",
            "meaning": "Unlatching gate to clear path",
            "role": "semantic"
        },
        {
            "radical": "始 (shǐ)",
            "pinyin": "shǐ",
            "meaning": "女 + 台 — mother giving birth to new life",
            "role": "semantic"
        }
    ],
    "story": "开 originally depicts hands unlatching a gate to open a path, while 始 depicts a mother giving birth to new life.",
    "exampleSentence": {
        "cn": "我们现在开始吧！",
        "pinyin": "Wǒmen xiànzài kāishǐ ba!",
        "en": "Let's start now!",
        "highlightWord": "开始"
    },
    "audioSrc": "kaishi_voice_single_pass_fast.mp3",
    "bgmAudioSrc": "chinese_lofi_bgm.mp3",
    "wordsAlignment": words_alignment,
    "screenTimestamps": {
        "screen1EndSec": w_s1_end['start'],
        "screen1EndFrame": s1_end_frame,
        "screen2EndSec": w_s2_end['start'],
        "screen2EndFrame": s2_end_frame,
        "screen3EndSec": w_s3_end['start'],
        "screen3EndFrame": s3_end_frame,
        "lessonTotalSec": audio_dur,
        "lessonTotalFrames": total_frames
    },
    "animationTimestamps": {
        "screen1": {
            "startFrame": 0,
            "endFrame": s1_end_frame,
            "clothMention": {
                "startSec": w_cloth['start'],
                "endSec": w_cloth['end'],
                "startFrame": sec_to_frame(w_cloth['start']),
                "endFrame": sec_to_frame(w_cloth['end'])
            },
            "wallMention": {
                "startSec": w_wall['start'],
                "endSec": w_wall['end'],
                "startFrame": sec_to_frame(w_wall['start']),
                "endFrame": sec_to_frame(w_wall['end'])
            },
            "altarMention": {
                "startSec": w_altar['start'],
                "endSec": w_altar['end'],
                "startFrame": sec_to_frame(w_altar['start']),
                "endFrame": sec_to_frame(w_altar['end'])
            },
            "muscleMention": {
                "startSec": w_altar['start'],
                "endSec": w_altar['end'],
                "startFrame": sec_to_frame(w_altar['start']),
                "endFrame": sec_to_frame(w_altar['end'])
            }
        },
        "screen2": {
            "startFrame": s1_end_frame,
            "endFrame": s2_end_frame,
            "topBang": {
                "startFrame": s1_end_frame,
                "endFrame": top_bang_end_frame
            },
            "bottomJin": {
                "startFrame": top_bang_end_frame,
                "endFrame": s2_end_frame
            },
            "wholeBang": {
                "startFrame": top_bang_end_frame,
                "endFrame": s2_end_frame
            }
        },
        "screen3": {
            "startFrame": s2_end_frame,
            "endFrame": s3_end_frame,
            "wholeZhuIntro": {
                "startFrame": s2_end_frame,
                "endFrame": sec_to_frame(w_left_start['start'])
            },
            "leftQie": {
                "startFrame": sec_to_frame(w_left_start['start']),
                "endFrame": left_qie_end_frame
            },
            "rightLi": {
                "startFrame": sec_to_frame(w_right_start['start']),
                "endFrame": right_li_end_frame
            },
            "wholeZhuOutro": {
                "startFrame": right_li_end_frame,
                "endFrame": s3_end_frame
            }
        },
        "screen4": {
            "startFrame": s3_end_frame,
            "endFrame": total_frames,
            "bangHighlightEndFrame": bang_highlight_end_frame
        }
    },
    "lessonDurationInFrames": total_frames,
    "outroDurationInFrames": 0
}

with open(out_path, 'w') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print(f"✅ Generated 1.2x config: totalFrames={total_frames}, s1End={s1_end_frame}, s2End={s2_end_frame}, s3End={s3_end_frame}")
