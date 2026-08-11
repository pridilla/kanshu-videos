#!/usr/bin/env python3
"""
Generate Single-Pass Voiceover Audio (v3 + Character+Pinyin Formatting)
-----------------------------------------------------------------------
Calls ElevenLabs v3 with-timestamps API to generate a pristine, single-pass master audio file.
"""

import os
import sys
import json
import base64
import argparse
import urllib.request
import ssl

ssl._create_default_https_context = ssl._create_unverified_context


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

def main():
    parser = argparse.ArgumentParser(description="Generate single-pass master audio using ElevenLabs v3")
    parser.add_argument('--voice_id', default='tnSpp4vdxKPjI9w0GnoV')
    parser.add_argument('--model_id', default='eleven_v3')
    parser.add_argument('--output', default='/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/bangzhu_voice_single_pass.mp3')
    parser.add_argument('--alignment_json', default='/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/bangzhu_voice_single_pass_alignment.json')
    parser.add_argument('--text', default=None)
    parser.add_argument('--text_file', default=None)
    args = parser.parse_args()

    api_key = load_api_key()
    if not api_key:
        print("Error: ELEVENLABS_API_KEY not found!")
        sys.exit(1)

    if args.text:
        transcript = args.text
    elif args.text_file and os.path.exists(args.text_file):
        with open(args.text_file, 'r', encoding='utf-8') as f:
            transcript = f.read().strip()
    else:
        transcript = (
            "Why does the Chinese word for help, 帮助 (bāngzhù), contain cloth, a city wall, an altar, and flexing muscles?\n\n"
            "Let's break down 帮 (bāng) first. The top part is 邦 (bāng), representing a territory. The bottom part is 巾 (jīn), a strip of woven cloth. "
            "Ancient cobblers used cloth strips to reinforce shoe borders so they wouldn't tear. 帮 (bāng) literally means providing protective reinforcement so someone doesn't fall apart.\n\n"
            "Now look at 助 (zhù). The left part is 且 (zhǔ), an ancient heavy stone altar. The right part is 力 (lì), a flexed muscle. "
            "Lifting a heavy altar required teamwork and strength. 助 (zhù) literally means applying muscle power to help someone lift a heavy burden.\n\n"
            "Put them together: 帮 (bāng) is the protective backing, and 助 (zhù) is the muscle power!"
        )

    print(f"Generating single-pass audio using model '{args.model_id}' and voice '{args.voice_id}'...")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{args.voice_id}/with-timestamps"
    payload = {
        "text": transcript,
        "model_id": args.model_id,
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

    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                res = json.loads(response.read().decode('utf-8'))
                audio_bytes = base64.b64decode(res['audio_base64'])
                alignment = res.get('alignment', {})

                os.makedirs(os.path.dirname(args.output), exist_ok=True)
                with open(args.output, 'wb') as f:
                    f.write(audio_bytes)
                print(f"✅ Single-pass master audio saved to: {args.output} ({len(audio_bytes)} bytes)")

                with open(args.alignment_json, 'w') as f:
                    json.dump(alignment, f, indent=2, ensure_ascii=False)
                print(f"✅ Alignment metadata saved to: {args.alignment_json}")
            else:
                print(f"❌ API Error: HTTP status {response.status}")
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == '__main__':
    main()
