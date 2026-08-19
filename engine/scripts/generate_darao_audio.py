#!/usr/bin/env python3
import os
import sys
import json
import base64
import subprocess
import urllib.request

env_path = os.path.expanduser('~/.env')
api_key = None

if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line.startswith('ELEVENLABS_API_KEY=') or line.startswith('ELEVEN_API_KEY='):
                val = line.split('=', 1)[1].strip().strip('"\'')
                while 'ELEVENLABS_API_KEY=' in val or 'ELEVEN_API_KEY=' in val:
                    val = val.replace('ELEVENLABS_API_KEY=', '').replace('ELEVEN_API_KEY=', '').strip().strip('"\'')
                api_key = val
                break

if not api_key:
    print("Error: ELEVENLABS_API_KEY not found in ~/.env")
    sys.exit(1)

voice_id = "tnSpp4vdxKPjI9w0GnoV"
url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps"

text_script = """EXCUSE ME in Chinese is 打扰 (dǎrǎo). 
It literally means "hitting monkeys". 
But why?

Look at 打 (dǎ). 
On the left is 扌 (shǒu), a hand. 
On the right is 丁 (dīng), striking like a nail. 
Together, it means striking with your hands!

Now look at 扰 (rǎo). 
On the left is 扌 (shǒu), another hand. 
On the right is 尤 (yóu), a chaotic beast. 
It originally pictured swatting away wild, mischievous monkeys!

Put them together, and 打扰 (dǎrǎo) means stirring up chaotic monkeys. 
That's why when you politely interrupt someone, you say 打扰 (dǎrǎo) — sorry for the monkey chaos!"""

# Save script file
script_file = os.path.expanduser('~/Documents/fun/kanshu/videos/engine/darao_script.txt')
with open(script_file, 'w', encoding='utf-8') as f:
    f.write(text_script)

payload = {
    "text": text_script,
    "model_id": "eleven_v3",
    "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.75,
        "style": 0.1
    }
}

data = json.dumps(payload).encode('utf-8')
headers = {
    "xi-api-key": api_key,
    "Content-Type": "application/json"
}

req = urllib.request.Request(url, data=data, headers=headers, method='POST')

output_audio_path = os.path.expanduser('~/Documents/fun/kanshu/videos/engine/public/darao_voice_single_pass.mp3')
output_json_path = os.path.expanduser('~/Documents/fun/kanshu/videos/engine/public/darao_voice_single_pass_alignment.json')
output_fast_audio_path = os.path.expanduser('~/Documents/fun/kanshu/videos/engine/public/darao_voice_single_pass_fast.mp3')

os.makedirs(os.path.dirname(output_audio_path), exist_ok=True)

try:
    print("Requesting ElevenLabs single-pass voiceover with timestamps (eleven_v3)...")
    with urllib.request.urlopen(req) as response:
        if response.status == 200:
            res_data = json.loads(response.read().decode('utf-8'))
            audio_base64 = res_data.get('audio_base64')
            alignment = res_data.get('alignment')
            
            if audio_base64:
                with open(output_audio_path, 'wb') as f:
                    f.write(base64.b64decode(audio_base64))
                print(f"✅ Saved raw audio to: {output_audio_path}")
            
            if alignment:
                with open(output_json_path, 'w', encoding='utf-8') as f:
                    json.dump(alignment, f, indent=2, ensure_ascii=False)
                print(f"✅ Saved alignment metadata to: {output_json_path}")
            
            # Accelerate audio with ffmpeg by 1.35x
            cmd = [
                'ffmpeg', '-y',
                '-i', output_audio_path,
                '-filter:a', 'atempo=1.35',
                '-c:a', 'mp3',
                '-b:a', '192k',
                output_fast_audio_path
            ]
            print(f"Accelerating audio (1.35x tempo) -> {output_fast_audio_path}...")
            subprocess.run(cmd, check=True)
            print("✅ Audio generated and accelerated successfully!")
        else:
            print(f"Failed with status code: {response.status}")
            sys.exit(1)
except Exception as e:
    print(f"Exception occurred while requesting ElevenLabs API: {e}")
    sys.exit(1)
