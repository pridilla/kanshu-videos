import json

def sec_to_frame(sec, fps=60):
    return int(round(sec * fps))

speed_factor = 1.15
align = json.load(open('public/wangji_voice_single_pass_alignment.json'))

chars = align['characters']
starts = align['character_start_times_seconds']
ends = align['character_end_times_seconds']

raw_words = []
current_word = []
ws = None
we = None
for c, s, e in zip(chars, starts, ends):
    if c in [' ', '\n', '\t']:
        if current_word:
            raw_words.append({'word': ''.join(current_word).strip(), 'start': ws, 'end': we})
            current_word = []
            ws = None
            we = None
    else:
        if ws is None: ws = s
        we = e
        current_word.append(c)

if current_word:
    raw_words.append({'word': ''.join(current_word).strip(), 'start': ws, 'end': we})

words_alignment = []
for wa in raw_words:
    words_alignment.append({
        "word": wa['word'],
        "start": round(wa['start'] / speed_factor, 3),
        "end": round(wa['end'] / speed_factor, 3)
    })

# Manually defined boundaries based on analysis (pre-scaled)
screen1_end_sec = 3.203
screen2_end_sec = 17.240
screen3_end_sec = 29.814
lesson_total_sec = 36.666

# Screen 1 Mentions
ghost_s, ghost_e = 1.716, 2.230
words_s, words_e = 2.577, 3.064
heart_s, heart_e = 2.577, 3.064 # unused
oneself_s, oneself_e = 2.577, 3.064 # unused

# Screen 2
wang_top_sec = 6.264
wang_bottom_sec = 10.299
wang_whole_sec = 14.681

# Screen 3
ji_intro_sec = 17.240
ji_left_sec = 20.249
ji_right_sec = 23.518
ji_whole_sec = 26.370

# Screen 4
highlight_sec = 31.587

animation_timestamps = {
    "screen1": {
        "startFrame": 0,
        "endFrame": sec_to_frame(screen1_end_sec),
        "clothMention": { "startFrame": sec_to_frame(ghost_s), "endFrame": sec_to_frame(ghost_e) },
        "wallMention": { "startFrame": sec_to_frame(words_s), "endFrame": sec_to_frame(words_e) },
        "altarMention": { "startFrame": sec_to_frame(heart_s), "endFrame": sec_to_frame(heart_e) },
        "muscleMention": { "startFrame": sec_to_frame(oneself_s), "endFrame": sec_to_frame(oneself_e) }
    },
    "screen2": {
        "startFrame": sec_to_frame(screen1_end_sec),
        "endFrame": sec_to_frame(screen2_end_sec),
        "topBang": { "startFrame": sec_to_frame(screen1_end_sec), "endFrame": sec_to_frame(wang_bottom_sec) },
        "bottomJin": { "startFrame": sec_to_frame(wang_bottom_sec), "endFrame": sec_to_frame(wang_whole_sec) },
        "wholeBang": { "startFrame": sec_to_frame(wang_whole_sec), "endFrame": sec_to_frame(screen2_end_sec) }
    },
    "screen3": {
        "startFrame": sec_to_frame(screen2_end_sec),
        "endFrame": sec_to_frame(screen3_end_sec),
        "wholeZhuIntro": { "startFrame": sec_to_frame(screen2_end_sec), "endFrame": sec_to_frame(ji_left_sec) },
        "leftQie": { "startFrame": sec_to_frame(ji_left_sec), "endFrame": sec_to_frame(ji_right_sec) },
        "rightLi": { "startFrame": sec_to_frame(ji_right_sec), "endFrame": sec_to_frame(ji_whole_sec) },
        "wholeZhuOutro": { "startFrame": sec_to_frame(ji_whole_sec), "endFrame": sec_to_frame(screen3_end_sec) }
    },
    "screen4": {
        "startFrame": sec_to_frame(screen3_end_sec),
        "endFrame": sec_to_frame(lesson_total_sec),
        "bangHighlightEndFrame": sec_to_frame(highlight_sec)
    }
}

screen_timestamps = {
    "screen1EndSec": round(screen1_end_sec, 3),
    "screen1EndFrame": sec_to_frame(screen1_end_sec),
    "screen2EndSec": round(screen2_end_sec, 3),
    "screen2EndFrame": sec_to_frame(screen2_end_sec),
    "screen3EndSec": round(screen3_end_sec, 3),
    "screen3EndFrame": sec_to_frame(screen3_end_sec),
    "lessonTotalSec": round(lesson_total_sec, 3),
    "lessonTotalFrames": sec_to_frame(lesson_total_sec)
}

config_path = '../content/07_etymology_wangji/config.json'
with open(config_path, 'r') as f:
    cfg = json.load(f)

cfg['audioSrc'] = 'wangji_voice_single_pass_fast.mp3'
cfg['character'] = '忘记'
cfg['pinyin'] = 'wàng jì'
cfg['wordsAlignment'] = words_alignment
cfg['screenTimestamps'] = screen_timestamps
cfg['animationTimestamps'] = animation_timestamps
cfg['lessonDurationInFrames'] = sec_to_frame(lesson_total_sec)

with open(config_path, 'w') as f:
    json.dump(cfg, f, indent=2, ensure_ascii=False)

print("Updated wangji config!")
