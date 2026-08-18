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
align_path = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/dongxi_voice_single_pass_alignment.json"
audio_path = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/dongxi_voice_single_pass_fast.mp3"
out_dir = "/Users/peterridilla/Documents/fun/kanshu/videos/content/11_etymology_dongxi"
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

s1_end_frame = sec_to_frame(words_alignment[14]['start']) # 332
s2_end_frame = sec_to_frame(words_alignment[40]['start']) # 784
s3_end_frame = sec_to_frame(words_alignment[61]['start']) # 1094

box_mention_start = sec_to_frame(words_alignment[5]['start']) # 92
box_mention_end = sec_to_frame(words_alignment[7]['end']) # 167

compass_mention_start = sec_to_frame(words_alignment[11]['start']) # 217
compass_mention_end = sec_to_frame(words_alignment[11]['end']) # 281

sack_end = sec_to_frame(words_alignment[30]['end']) # 668
s4_highlight_switch = sec_to_frame(words_alignment[89]['start']) # 1643

config = {
    "character": "东西",
    "pinyin": "dōng xi",
    "tone": 1,
    "meaning": "Thing / Objects",
    "oracleBoneSymbol": "🌅🌇",
    "radicals": [
        {
            "radical": "东 (dōng)",
            "pinyin": "dōng",
            "meaning": "Sunrise + travel sack bundled on carrying pole",
            "role": "semantic"
        },
        {
            "radical": "西 (xī)",
            "pinyin": "xī",
            "meaning": "Sunset + bird roosting safely in woven nest",
            "role": "semantic"
        }
    ],
    "story": "东 originally depicted a travel sack on a pole pointing to the sunrise in the East, while 西 showed a bird resting in its nest at sunset in the West. In ancient Chang'an, shopping was only allowed in East & West markets, so buying goods became 'buying East and West' (买东西)!",
    "exampleSentence": {
        "cn": "你去买什么东西？",
        "pinyin": "Nǐ qù mǎi shénme dōngxi?",
        "en": "What things are you going to buy?",
        "highlightWord": "东西"
    },
    "audioSrc": "dongxi_voice_single_pass_fast.mp3",
    "bgmAudioSrc": "chinese_lofi_bgm.mp3",
    "wordsAlignment": words_alignment,
    "screenTimestamps": {
        "screen1EndSec": words_alignment[14]['start'],
        "screen1EndFrame": s1_end_frame,
        "screen2EndSec": words_alignment[40]['start'],
        "screen2EndFrame": s2_end_frame,
        "screen3EndSec": words_alignment[61]['start'],
        "screen3EndFrame": s3_end_frame,
        "lessonTotalSec": audio_dur,
        "lessonTotalFrames": total_frames
    },
    "animationTimestamps": {
        "screen1": {
            "startFrame": 0,
            "endFrame": s1_end_frame,
            "clothMention": {
                "startFrame": box_mention_start,
                "endFrame": box_mention_end
            },
            "wallMention": {
                "startFrame": compass_mention_start,
                "endFrame": compass_mention_end
            },
            "altarMention": {
                "startFrame": compass_mention_start,
                "endFrame": compass_mention_end
            },
            "muscleMention": {
                "startFrame": compass_mention_start,
                "endFrame": compass_mention_end
            }
        },
        "screen2": {
            "startFrame": s1_end_frame,
            "endFrame": s2_end_frame,
            "topBang": {
                "startFrame": s1_end_frame,
                "endFrame": sack_end
            },
            "bottomJin": {
                "startFrame": sack_end,
                "endFrame": s2_end_frame
            },
            "wholeBang": {
                "startFrame": sack_end,
                "endFrame": s2_end_frame
            }
        },
        "screen3": {
            "startFrame": s2_end_frame,
            "endFrame": s3_end_frame,
            "wholeZhuIntro": {
                "startFrame": s2_end_frame,
                "endFrame": s2_end_frame + 60
            },
            "leftQie": {
                "startFrame": s2_end_frame + 60,
                "endFrame": s3_end_frame - 60
            },
            "rightLi": {
                "startFrame": s2_end_frame + 60,
                "endFrame": s3_end_frame - 60
            },
            "wholeZhuOutro": {
                "startFrame": s3_end_frame - 60,
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

print(f"✅ Generated final accurate dongxi config: total={total_frames}, s1={s1_end_frame}, s2={s2_end_frame}, s3={s3_end_frame}, s4Switch={s4_highlight_switch}")
