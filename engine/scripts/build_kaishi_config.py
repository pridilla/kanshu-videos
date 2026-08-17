import os
import json
import subprocess

def get_audio_duration(file_path):
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file_path]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return float(res.stdout.strip())

def sec_to_frame(sec, fps=60):
    return int(round(sec * fps))

speed_factor = 1.15
align_path = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/kaishi_voice_single_pass_alignment.json"
audio_path = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/kaishi_voice_single_pass_fast.mp3"
out_dir = "/Users/peterridilla/Documents/fun/kanshu/videos/content/09_etymology_kaishi"
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

print(f"Total aligned words: {len(words_alignment)}")
for i, w in enumerate(words_alignment):
    print(f"{i:3d}: {w['word']:<20} {w['start']:6.3f}s - {w['end']:6.3f}s ({sec_to_frame(w['start'])}f - {sec_to_frame(w['end'])}f)")

audio_dur = get_audio_duration(audio_path)
total_frames = sec_to_frame(audio_dur)
print(f"Audio duration: {audio_dur}s -> {total_frames} frames")
