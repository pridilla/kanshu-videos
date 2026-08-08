import os
import sys
import json
import urllib.request

# Load ELEVENLABS_API_KEY from ~/.env safely
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
url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

text_script = "Want to read real Chinese books without stopping to look up words? Download Kanshu today — your AI-powered Chinese reader."

payload = {
    "text": text_script,
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.75,
        "style": 0.1
    }
}

data = json.dumps(payload).encode('utf-8')
headers = {
    "xi-api-key": api_key,
    "Content-Type": "application/json",
    "Accept": "audio/mpeg"
}

req = urllib.request.Request(url, data=data, headers=headers, method='POST')

output_path = os.path.expanduser('~/Documents/fun/kanshu/videos/engine/public/kanshu_outro_elevenlabs.mp3')
os.makedirs(os.path.dirname(output_path), exist_ok=True)

try:
    with urllib.request.urlopen(req) as response:
        if response.status == 200:
            with open(output_path, 'wb') as f:
                f.write(response.read())
            print(f"Successfully generated ElevenLabs voiceover at: {output_path}")
        else:
            print(f"Failed with status code: {response.status}")
except Exception as e:
    print(f"Exception occurred while requesting ElevenLabs API: {e}")
    sys.exit(1)
