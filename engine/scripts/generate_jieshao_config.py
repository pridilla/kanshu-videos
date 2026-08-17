import json

with open('../content/08_etymology_jieshao/config.json', 'r') as f:
    config = json.load(f)

config['character'] = "介绍"
config['pinyin'] = "jiè shào"
config['tone'] = 4
config['meaning'] = "Introduce"
config['oracleBoneSymbol'] = "🤝🧍"
config['radicals'] = [
    {
      "radical": "介 (jiè)",
      "pinyin": "jiè",
      "meaning": "人 + 八 — a person between boundaries",
      "role": "semantic"
    },
    {
      "radical": "绍 (shào)",
      "pinyin": "shào",
      "meaning": "纟 + 召 — continuous silk thread",
      "role": "semantic"
    }
]
config['story'] = "介 originally meant a person standing between two things, while 绍 means to link things together like a continuous thread."
config['exampleSentence'] = {
    "cn": "我给你介绍一下。",
    "pinyin": "Wǒ gěi nǐ jièshào yíxià.",
    "en": "Let me introduce you.",
    "highlightWord": "介绍"
}

# Timestamps based on wordsAlignment
config['screenTimestamps'] = {
    "screen1EndSec": 4.0,
    "screen1EndFrame": 240,
    "screen2EndSec": 16.14,
    "screen2EndFrame": 970,
    "screen3EndSec": 28.53,
    "screen3EndFrame": 1715,
    "lessonTotalSec": 37.042,
    "lessonTotalFrames": 2222
}

config['animationTimestamps'] = {
    "screen1": {
      "startFrame": 0,
      "endFrame": 240,
      "personMention": {
        "startSec": 1.3,
        "endSec": 1.7,
        "startFrame": 78,
        "endFrame": 102
      },
      "boundariesMention": {
        "startSec": 2.06,
        "endSec": 2.58,
        "startFrame": 124,
        "endFrame": 155
      },
      "silkMention": {
        "startSec": 2.76,
        "endSec": 3.0,
        "startFrame": 166,
        "endFrame": 180
      }
    },
    "screen2": {
      "startFrame": 240,
      "endFrame": 970,
      "topBang": {
        "startFrame": 240,
        "endFrame": 520
      },
      "bottomJin": {
        "startFrame": 520,
        "endFrame": 680
      },
      "wholeBang": {
        "startFrame": 680,
        "endFrame": 970
      }
    },
    "screen3": {
      "startFrame": 970,
      "endFrame": 1715,
      "wholeZhuIntro": {
        "startFrame": 970,
        "endFrame": 1100
      },
      "leftQie": {
        "startFrame": 1100,
        "endFrame": 1300
      },
      "rightLi": {
        "startFrame": 1300,
        "endFrame": 1440
      },
      "wholeZhuOutro": {
        "startFrame": 1440,
        "endFrame": 1715
      }
    },
    "screen4": {
      "startFrame": 1715,
      "endFrame": 2222,
      "bangHighlightEndFrame": 1837
    }
}

with open('../content/08_etymology_jieshao/config.json', 'w') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)
