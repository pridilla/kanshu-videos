#!/Users/peterridilla/.hermes/hermes-agent/venv/bin/python3
"""Compress all Y coordinates in reel.html to fit within Y=100-900"""
import re

with open('/Users/peterridilla/Documents/fun/kanshu/videos/01_silent_period/reel.html') as f:
    content = f.read()

# Find all H*0.XX patterns in scene functions (not in constants or definitions)
# Replace with compressed values: multiply by 0.65, clip to max 0.49
def compress_y(m):
    val = float(m.group(1))
    new_val = round(min(val * 0.65, 0.49), 2)
    return f'H*{new_val}'

# Only replace within scene function context (after "// === SCENE FUNCTIONS ===" and before "// === WORD-LEVEL")
start_marker = "// === SCENE FUNCTIONS ==="
end_marker = "// === WORD-LEVEL TIMING DATA"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx >= 0 and end_idx >= 0:
    before = content[:start_idx]
    scenes = content[start_idx:end_idx]
    after = content[end_idx:]
    
    # Replace H*0.XX patterns in the scene section
    scenes = re.sub(r'H\*0\.(\d{2})', lambda m: f'H*{min(int(m.group(1))*65//100, 49)/100:.2f}'.rstrip('0').rstrip('.'), scenes)
    
    content = before + scenes + after
    
    with open('/Users/peterridilla/Documents/fun/kanshu/videos/01_silent_period/reel.html', 'w') as f:
        f.write(content)
    print("Done - Y coordinates compressed")
else:
    print("Could not find markers")
