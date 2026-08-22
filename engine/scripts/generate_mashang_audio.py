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

text_script = """When Chinese people say "I'm doing it right now", they literally say: "I am on a horse!"
马上 (mǎ shàng) means "immediately". But why a horse?

The first character is 马 (mǎ). 
It originally pictured a wild horse with a flowing mane and four galloping hooves.

The second character is 上 (shàng). 
A baseline stroke pointing upwards, meaning "on top" or "to mount".

In ancient China, the fastest urgent imperial messages were delivered on horseback.
So "on a horse" became the universal word for: "Right this second!"
Master Chinese characters with Kanshu.app!"""

# Save script file
script_file = os.path.expanduser('~/Documents/fun/kanshu/videos/engine/mashang_script.txt')
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

output_audio_path = os.path.expanduser('~/Documents/fun/kanshu/videos/engine/public/mashang_voice_single_pass.mp3')
output_json_path = os.path.expanduser('~/Documents/fun/kanshu/videos/engine/public/mashang_voice_single_pass_alignment.json')
output_fast_audio_path = os.path.expanduser('~/Documents/fun/kanshu/videos/engine/public/mashang_voice_single_pass_fast.mp3')

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
            
            # Accelerate audio with ffmpeg by 1.38x
            cmd = [
                'ffmpeg', '-y',
                '-i', output_audio_path,
                '-filter:a', 'atempo=1.38',
                '-c:a', 'mp3',
                '-b:a', '192k',
                output_fast_audio_path
            ]
            subprocess.run(cmd, check=True)
            print(f"✅ Accelerated audio generated (1.38x): {output_fast_audio_path}")
        else:
            print(f"Error: API returned status code {response.status}")
            sys.exit(1)
except Exception as e:
    print(f"Exception during ElevenLabs request: {e}")
    sys.exit(1)
