#!/usr/bin/env python3
import os

template_path = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/src/templates/EtymologyTemplate.tsx"

with open(template_path, 'r') as f:
    content = f.read()

# 1. Update OrganicCenterTag top position and dimensions
content = content.replace("top: 680,", "top: 730,")
content = content.replace("height: 680,", "height: 500,")
content = content.replace("padding: '14px 38px',", "padding: '10px 32px',")
content = content.replace("fontSize: 40, fontWeight: 900, color: '#FFFFFF'", "fontSize: 36, fontWeight: 900, color: '#FFFFFF'")
content = content.replace("fontSize: 28, fontWeight: 700, color: '#94A3B8'", "fontSize: 24, fontWeight: 700, color: '#94A3B8'")
content = content.replace("fontSize: 28, fontWeight: 700, color: '#FF6F59'", "fontSize: 24, fontWeight: 700, color: '#FF6F59'")

# 2. Update Top Header container
content = content.replace(
    "<div style={{ marginTop: 20, height: 180, textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}>",
    "<div style={{ marginTop: 240, height: 150, textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}>"
)
content = content.replace("padding: '20px 44px',", "padding: '16px 36px',")
content = content.replace("fontSize: 58, color: '#FF6F59'", "fontSize: 48, color: '#FF6F59'")
content = content.replace("fontSize: 32, color: '#FFFFFF'", "fontSize: 28, color: '#FFFFFF'")
content = content.replace("fontSize: 50, color: '#0F172A'", "fontSize: 44, color: '#0F172A'")
content = content.replace("fontSize: 52, color: '#0F172A'", "fontSize: 46, color: '#0F172A'")

# 3. Update Character Stage and Hanzi
content = content.replace(
    "width: '100%',\n              height: 420,\n              marginTop: 25,",
    "width: '100%',\n              height: 320,\n              marginTop: 15,"
)
content = content.replace("fontSize: 250,", "fontSize: 210,")

# 4. Update Spotlight Y coordinate and radius
content = content.replace("spot2Y = 240;", "spot2Y = 160;")
content = content.replace("spot3Y = 240;", "spot3Y = 160;")
content = content.replace("spot2R = 170;", "spot2R = 140;")
content = content.replace("spot2R = 190;", "spot2R = 150;")
content = content.replace("spot2R = 210;", "spot2R = 160;")
content = content.replace("spot3R = 180;", "spot3R = 150;")
content = content.replace("spot3R = 210;", "spot3R = 160;")

# 5. Update Captions positionBottom
content = content.replace(
    "<RealtimeCaptions words={wordsAlignment} positionBottom={110} />",
    "<RealtimeCaptions words={wordsAlignment} positionBottom={440} />"
)
content = content.replace(
    "<RealtimeCaptions words={wordsAlignment} />",
    "<RealtimeCaptions words={wordsAlignment} positionBottom={440} />"
)

with open(template_path, 'w') as f:
    f.write(content)

print(f"✅ Successfully updated {template_path} with Safe Zone dimensions!")
