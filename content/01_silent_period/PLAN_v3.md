# New Approach: Declarative Animation Engine (Canvas)

## Instead of React Native + Reanimated

Instead of porting to RN (which would take days and lose the 23fps render speed), I'll rebuild the Canvas engine with a **declarative animation DSL** that mirrors Reanimated's core concepts:

### Current problems:
1. Every scene function writes its own ad-hoc `clamp()` + manual easing ≈ janky
2. No unified transition system ≈ abrupt scene pops
3. Icon animations are manual and inconsistent
4. Timing gaps cause blank frames

### New animation system:

```js
// Declarative scene definition instead of imperative drawing
SCENE_KONFIG = {
  hook: {
    elements: [
      { type: 'text', text: 'START', style: 'h1', y: 0.13, color: 'text' },
      { type: 'text', text: 'SPEAKING', style: 'h2', y: 0.22, color: 'primary' },
      { 
        type: 'icon', icon: 'close', y: 0.22, 
        enter: { at: 2.0, dur: 0.4, ease: 'back' } // declarative timing
      },
    ]
  },
  // ... all 22 scenes
}
```

### Or even simpler — use the Canvas we have but with:
1. A reusable `anim` object with proper easing (back, spring-like, cubic, expo)
2. Scene transition wrapper that handles crossfade
3. Icon entrance animators (scale + fade from 0)
4. Single-tick frame composer

This gives us Reanimated-quality motion in ~1 hour of coding instead of 3+ days.
