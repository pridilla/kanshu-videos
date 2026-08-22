#!/usr/bin/env python3
import math
import struct
import wave
import subprocess

def create_sine_tone(filename, freq, duration, sample_rate=44100, volume=0.5, decay=True):
    n_samples = int(sample_rate * duration)
    with wave.open(filename, 'w') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        
        for i in range(n_samples):
            t = float(i) / sample_rate
            env = math.exp(-t * (5.0 if decay else 0.0))
            val = math.sin(2.0 * math.pi * freq * t) * volume * env
            data = struct.pack('<h', int(val * 32767.0))
            wav.writeframes(data)

def create_chime():
    # 2-tone harmonic chime (880Hz + 1760Hz)
    sr = 44100
    duration = 0.6
    n_samples = int(sr * duration)
    with wave.open('public/sfx_chime.wav', 'w') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sr)
        for i in range(n_samples):
            t = float(i) / sr
            env = math.exp(-t * 6.0)
            val1 = math.sin(2.0 * math.pi * 1046.5 * t) * 0.4 # C6
            val2 = math.sin(2.0 * math.pi * 1318.5 * t) * 0.3 # E6
            val3 = math.sin(2.0 * math.pi * 1567.98 * t) * 0.3 # G6
            val = (val1 + val2 + val3) * env
            data = struct.pack('<h', int(val * 32767.0))
            wav.writeframes(data)
    # Convert to mp3
    subprocess.run(['ffmpeg', '-y', '-i', 'public/sfx_chime.wav', '-b:a', '192k', 'public/sfx_chime.mp3'], check=True)

def create_msg_pop():
    sr = 44100
    duration = 0.15
    n_samples = int(sr * duration)
    with wave.open('public/sfx_msg_pop.wav', 'w') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sr)
        for i in range(n_samples):
            t = float(i) / sr
            # Pitch slide 600Hz -> 1400Hz
            freq = 600 + (t / duration) * 800
            env = math.exp(-t * 18.0)
            val = math.sin(2.0 * math.pi * freq * t) * 0.6 * env
            data = struct.pack('<h', int(val * 32767.0))
            wav.writeframes(data)
    # Convert to mp3
    subprocess.run(['ffmpeg', '-y', '-i', 'public/sfx_msg_pop.wav', '-b:a', '192k', 'public/sfx_msg_pop.mp3'], check=True)

if __name__ == '__main__':
    create_chime()
    create_msg_pop()
    print("✅ Created sfx_chime.mp3 and sfx_msg_pop.mp3")
