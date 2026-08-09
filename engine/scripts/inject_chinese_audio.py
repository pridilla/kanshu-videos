#!/usr/bin/env python3
"""
Chinese Audio Injector for Kanshu Video Engine (v3 - Exact Trimmed Mandarin Injection)
---------------------------------------------------------------------------------------
1. Uses `eleven_v3` with Character + Pinyin context ('帮助 (bāngzhù)', '且 (zhǔ)', etc.)
   to generate 100% accurate native Mandarin Chinese speech.
2. Leverages ElevenLabs `with-timestamps` API character alignment to trim off trailing
   pinyin, leaving only the pristine Chinese character audio.
3. Splices Chinese audio snippets into exact alignment slots [t_start, t_end] parsed from config.json.
4. Centers audio in each slot with silence padding so preceding and succeeding English narration
   remain 100% anchored at their exact millisecond timestamps.
5. Updates config.json audioSrc property to point to the injected voiceover.
"""

import os
import sys
import json
import base64
import argparse
import subprocess
import urllib.request

def load_api_key():
    env_path = os.path.expanduser('~/.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line.startswith('ELEVENLABS_API_KEY=') or line.startswith('ELEVEN_API_KEY='):
                    val = line.split('=', 1)[1].strip().strip('"\'')
                    while 'ELEVENLABS_API_KEY=' in val or 'ELEVEN_API_KEY=' in val:
                        val = val.replace('ELEVENLABS_API_KEY=', '').replace('ELEVEN_API_KEY=', '').strip().strip('"\'')
                    return val
    return os.environ.get('ELEVENLABS_API_KEY') or os.environ.get('ELEVEN_API_KEY')

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

def generate_exact_chinese_snippet(text_context, voice_id, model_id, api_key, raw_mp3, exact_mp3):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps"
    payload = {
        "text": text_context,
        "model_id": model_id,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.0
        }
    }
    data = json.dumps(payload).encode('utf-8')
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    
    print(f"  [TTS] Requesting with-timestamps for '{text_context}' (model={model_id})...")
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                res = json.loads(response.read().decode('utf-8'))
                audio_bytes = base64.b64decode(res['audio_base64'])
                alignment = res.get('alignment', {})
                chars = alignment.get('characters', [])
                starts = alignment.get('character_start_times_seconds', [])
                ends = alignment.get('character_end_times_seconds', [])
                
                with open(raw_mp3, 'wb') as f:
                    f.write(audio_bytes)
                
                # Find exact cut time of the Chinese Hanzi character before space / open paren
                cut_time = 0.5
                for c, s, e in zip(chars, starts, ends):
                    if c in [' ', '(', 'b', 'j', 'z', 'l']:
                        break
                    cut_time = e
                
                cmd_trim = ['ffmpeg', '-y', '-i', raw_mp3, '-to', f'{cut_time:.3f}', '-c', 'copy', exact_mp3]
                subprocess.run(cmd_trim, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                print(f"  [TTS] Extracted pristine Chinese character audio cut at {cut_time:.3f}s -> {exact_mp3}")
                return True
            else:
                print(f"  [TTS Error] Status code {response.status}")
                return False
    except Exception as e:
        print(f"  [TTS Exception] {e}")
        return False

def splice_audio_slot(input_master, chinese_snippet, t_start, t_end, output_master, temp_dir):
    os.makedirs(temp_dir, exist_ok=True)
    slot_duration = t_end - t_start
    snippet_duration = get_audio_duration(chinese_snippet)
    
    part1_path = os.path.join(temp_dir, 'part1.wav')
    part3_path = os.path.join(temp_dir, 'part3.wav')
    fitted_snippet_path = os.path.join(temp_dir, 'chinese_fitted.wav')

    # Part 1: Audio before t_start (100% untouched)
    cmd_part1 = [
        'ffmpeg', '-y', '-ss', '0', '-to', str(t_start),
        '-i', input_master, '-ar', '44100', '-ac', '2', part1_path
    ]
    subprocess.run(cmd_part1, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Part 3: Audio after t_end (ANCHORED EXACTLY AT t_end!)
    cmd_part3 = [
        'ffmpeg', '-y', '-ss', str(t_end),
        '-i', input_master, '-ar', '44100', '-ac', '2', part3_path
    ]
    subprocess.run(cmd_part3, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Fit Chinese snippet into slot [t_start, t_end] with silence padding
    if snippet_duration <= slot_duration:
        pad_total = slot_duration - snippet_duration
        pad_left = pad_total / 2.0
        pad_right = pad_total - pad_left
        
        filter_complex = f"adelay={int(pad_left * 1000)}|{int(pad_left * 1000)},apad=pad_len={int(pad_right * 44100)}"
        cmd_fit = [
            'ffmpeg', '-y', '-i', chinese_snippet,
            '-af', filter_complex, '-ar', '44100', '-ac', '2',
            '-t', str(slot_duration), fitted_snippet_path
        ]
    else:
        speed_factor = snippet_duration / slot_duration
        cmd_fit = [
            'ffmpeg', '-y', '-i', chinese_snippet,
            '-filter:a', f'atempo={speed_factor:.4f}',
            '-ar', '44100', '-ac', '2', '-t', str(slot_duration), fitted_snippet_path
        ]
    subprocess.run(cmd_fit, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Concatenate part1 + fitted_snippet + part3
    concat_list_path = os.path.join(temp_dir, 'concat.txt')
    with open(concat_list_path, 'w') as f:
        f.write(f"file '{part1_path}'\n")
        f.write(f"file '{fitted_snippet_path}'\n")
        f.write(f"file '{part3_path}'\n")

    cmd_concat = [
        'ffmpeg', '-y', '-f', 'concat', '-safe', '0',
        '-i', concat_list_path, '-c:a', 'libmp3lame', '-b:a', '192k', output_master
    ]
    subprocess.run(cmd_concat, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"  [Splice] Successfully spliced snippet into slot [{t_start:.3f}s - {t_end:.3f}s]!")

def main():
    parser = argparse.ArgumentParser(description="Inject native Chinese audio snippets into master voiceover")
    parser.add_argument('--config', default='/Users/peterridilla/Documents/fun/kanshu/videos/content/04_etymology_bangzhu/config.json')
    parser.add_argument('--master', default='/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/bangzhu_voice.mp3')
    parser.add_argument('--voice_id', default='tnSpp4vdxKPjI9w0GnoV')
    parser.add_argument('--model_id', default='eleven_v3')
    parser.add_argument('--output', default='/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/bangzhu_voice_injected.mp3')
    args = parser.parse_args()

    api_key = load_api_key()
    if not api_key:
        print("Error: ELEVENLABS_API_KEY not found!")
        sys.exit(1)

    print(f"Loading alignment timestamps from config: {args.config}")
    with open(args.config, 'r') as f:
        cfg = json.load(f)

    alignment = cfg.get('wordsAlignment', [])
    
    # Map of Chinese words to their context prompts for 100% native Mandarin pronunciation
    prompt_map = {
        'bāngzhù,': '帮助 (bāngzhù)',
        '帮': '帮 (bāng)',
        '邦,': '邦 (bāng)',
        '巾,': '巾 (jīn)',
        '助.': '助 (zhù)',
        '且,': '且 (zhǔ)',
        '力,': '力 (lì)',
        '助': '助 (zhù)',
    }
    
    targets = []
    for item in alignment:
        w = item['word'].strip()
        if w in prompt_map:
            targets.append({
                "raw_word": w,
                "context_prompt": prompt_map[w],
                "t_start": item['start'],
                "t_end": item['end']
            })

    print(f"Found {len(targets)} target Chinese words in alignment:")
    for t in targets:
        print(f"  - '{t['raw_word']}' -> Prompt: '{t['context_prompt']}' [{t['t_start']:.3f}s - {t['t_end']:.3f}s]")

    temp_dir = '/tmp/kanshu_audio_injection_v3'
    os.makedirs(temp_dir, exist_ok=True)

    current_master = args.master
    for idx, item in enumerate(targets):
        raw_snippet = os.path.join(temp_dir, f"raw_snippet_{idx}.mp3")
        exact_snippet = os.path.join(temp_dir, f"exact_snippet_{idx}.mp3")
        step_output = os.path.join(temp_dir, f"master_step_{idx}.mp3") if idx < len(targets) - 1 else args.output
        
        print(f"\n--- Item {idx+1}/{len(targets)}: '{item['raw_word']}' [{item['t_start']:.3f}s - {item['t_end']:.3f}s] ---")
        success = generate_exact_chinese_snippet(item['context_prompt'], args.voice_id, args.model_id, api_key, raw_snippet, exact_snippet)
        if success:
            splice_audio_slot(current_master, exact_snippet, item['t_start'], item['t_end'], step_output, os.path.join(temp_dir, f"step_{idx}"))
            current_master = step_output

    # Update config.json to reference bangzhu_voice_injected.mp3
    output_filename = os.path.basename(args.output)
    cfg['audioSrc'] = output_filename
    with open(args.config, 'w') as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)
    print(f"\n✅ Updated {args.config} to use audioSrc: '{output_filename}'")
    print(f"✅ Injected master voiceover saved to: {args.output}")

if __name__ == '__main__':
    main()
