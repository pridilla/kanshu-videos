import json
import os
import subprocess

def get_audio_duration(file_path):
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file_path]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return float(res.stdout.strip())

def sec_to_frame(sec, fps=60):
    return int(round(sec * fps))

speed_factor = 1.35
align_path = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/xihuan_voice_single_pass_alignment.json"
audio_path = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/xihuan_voice_single_pass_fast.mp3"
out_dir = "/Users/peterridilla/Documents/fun/kanshu/videos/content/10_etymology_xihuan"
out_path = os.path.join(out_dir, "config.json")
os.makedirs(out_dir, exist_ok=True)

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

# Scene 1 ends at word 21 ("Let's" -> start: 6.074s)
s1_end_frame = sec_to_frame(words_alignment[21]['start']) # frame 364

# Drum mention in Scene 1: word 14-15 (3.79s - 4.27s)
drum_mention_start = sec_to_frame(words_alignment[14]['start'])
drum_mention_end = sec_to_frame(words_alignment[15]['end'])

# Cheering mention in Scene 1: word 17 (4.55s - 4.98s)
cheer_mention_start = sec_to_frame(words_alignment[17]['start'])
cheer_mention_end = sec_to_frame(words_alignment[17]['end'])

# Scene 2 ends at word 51 ("Now" -> start: 15.837s)
s2_end_frame = sec_to_frame(words_alignment[51]['start']) # frame 950

# In Scene 2:
# 壴 (drum): word 27 ("Originally" 7.78s) to word 34 ("over" 10.6s)
zhu_start = s1_end_frame
zhu_end = sec_to_frame(words_alignment[36]['start']) # word 36 "singing" -> 10.70s -> frame 642

# 口 (mouth): word 36 ("singing" 10.70s) to word 42 ("represents" 12.48s)
mouth_start = zhu_end
mouth_end = sec_to_frame(words_alignment[44]['start']) # word 44 "explosive" -> 13.09s -> frame 786

# 喜 (whole victory celebration): 13.09s to 15.84s
whole_xi_start = mouth_end
whole_xi_end = s2_end_frame

# Scene 3 ends at word 81 ("Put" -> start: 23.348s)
s3_end_frame = sec_to_frame(words_alignment[81]['start']) # frame 1401

# In Scene 3:
# Intro: 15.84s to word 58 ("left," -> 17.42s)
s3_intro_end = sec_to_frame(words_alignment[58]['start']) # frame 1045

# 又/雚 (bird): word 58 ("left," 17.42s) to word 63 ("on" 18.76s)
bird_start = s3_intro_end
bird_end = sec_to_frame(words_alignment[63]['start']) # frame 1126

# 欠 (qiàn / cheering mouth): word 63 ("on the right" 18.76s) to word 80 ("excitement!" 23.23s)
qian_start = bird_end
qian_end = sec_to_frame(words_alignment[80]['end']) # frame 1394

# 欢 (whole): frame 1340 to s3_end_frame
whole_huan_start = sec_to_frame(words_alignment[76]['start']) # frame 1304
whole_huan_end = s3_end_frame

# Scene 4: 23.35s (frame 1401) to total_frames (1834)
# Highlight 喜 during 23.35s to word 92 ("with" 26.69s -> frame 1601)
# Highlight 欢 during 26.69s to total_frames
s4_highlight_switch = sec_to_frame(words_alignment[92]['start']) # frame 1601

config = {
    "character": "喜欢",
    "pinyin": "xǐ huan",
    "tone": 3,
    "meaning": "To Like / Love",
    "oracleBoneSymbol": "🥁🎉",
    "radicals": [
        {
            "radical": "喜 (xǐ)",
            "pinyin": "xǐ",
            "meaning": "Victory war drum (壴) + singing mouth (口)",
            "role": "semantic"
        },
        {
            "radical": "欢 (huān)",
            "pinyin": "huān",
            "meaning": "Singing bird (又/雚) + open mouth cheering (欠)",
            "role": "semantic"
        }
    ],
    "story": "喜 depicts beating a celebratory victory drum with a singing mouth, while 欢 depicts cheering and gasping with joy.",
    "exampleSentence": {
        "cn": "我非常喜欢你！",
        "pinyin": "Wǒ fēicháng xǐhuan nǐ!",
        "en": "I really like you!",
        "highlightWord": "喜欢"
    },
    "audioSrc": "xihuan_voice_single_pass_fast.mp3",
    "bgmAudioSrc": "chinese_lofi_bgm.mp3",
    "wordsAlignment": words_alignment,
    "screenTimestamps": {
        "screen1EndSec": words_alignment[21]['start'],
        "screen1EndFrame": s1_end_frame,
        "screen2EndSec": words_alignment[51]['start'],
        "screen2EndFrame": s2_end_frame,
        "screen3EndSec": words_alignment[81]['start'],
        "screen3EndFrame": s3_end_frame,
        "lessonTotalSec": audio_dur,
        "lessonTotalFrames": total_frames
    },
    "animationTimestamps": {
        "screen1": {
            "startFrame": 0,
            "endFrame": s1_end_frame,
            "clothMention": {
                "startFrame": drum_mention_start,
                "endFrame": drum_mention_end
            },
            "wallMention": {
                "startFrame": cheer_mention_start,
                "endFrame": cheer_mention_end
            },
            "altarMention": {
                "startFrame": cheer_mention_start,
                "endFrame": cheer_mention_end
            },
            "muscleMention": {
                "startFrame": cheer_mention_start,
                "endFrame": cheer_mention_end
            }
        },
        "screen2": {
            "startFrame": s1_end_frame,
            "endFrame": s2_end_frame,
            "topBang": {
                "startFrame": s1_end_frame,
                "endFrame": zhu_end
            },
            "bottomJin": {
                "startFrame": zhu_end,
                "endFrame": mouth_end
            },
            "wholeBang": {
                "startFrame": mouth_end,
                "endFrame": s2_end_frame
            }
        },
        "screen3": {
            "startFrame": s2_end_frame,
            "endFrame": s3_end_frame,
            "wholeZhuIntro": {
                "startFrame": s2_end_frame,
                "endFrame": s3_intro_end
            },
            "leftQie": {
                "startFrame": s3_intro_end,
                "endFrame": bird_end
            },
            "rightLi": {
                "startFrame": bird_end,
                "endFrame": qian_end
            },
            "wholeZhuOutro": {
                "startFrame": whole_huan_start,
                "endFrame": s3_end_frame
            }
        },
        "screen4": {
            "startFrame": s3_end_frame,
            "endFrame": total_frames,
            "bangHighlightEndFrame": s4_highlight_switch
        }
    },
    "lessonDurationInFrames": total_frames,
    "outroDurationInFrames": 0
}

with open(out_path, 'w') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print(f"✅ Generated accurate xihuan config: total={total_frames}, s1={s1_end_frame}, s2={s2_end_frame}, s3={s3_end_frame}, s4Switch={s4_highlight_switch}")
