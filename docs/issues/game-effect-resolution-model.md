# GameEffect Resolution Model is Undefined

## Status

Open — needs design before further GameEffect-consuming features are built.

## Problem

`GameEffectData` entries can be attached to Items, Qualities, Spells, and (implied) other sources
such as Adept Powers, drugs, and matrix connection modes. There is currently no canonical layer
that aggregates all active effects and applies them to derived stats. Components appear to resolve
effects ad-hoc via selector hooks, but this has not been verified or standardised.

## Known Sources of GameEffects

Effects that modify the same derived stat (e.g. initiative passes) can originate from:

- **Gear** — cyberware (e.g. Wired Reflexes), weapons, armor
- **Adept Powers** — e.g. Increased Reflexes
- **Spells** — e.g. Increase Reflexes (sustained)
- **Qualities** — e.g. High Pain Tolerance, Low Pain Tolerance
- **Drugs / Compounds** _(not yet modelled)_
- **Matrix connection mode** — AR vs. Hot-sim VR vs. Cold-sim VR affects initiative dice
- **Potentially others** (critter powers, mentor spirits, etc.)

## Questions to Resolve

1. Is there a centralised "apply effects" selector, or is it purely ad-hoc per component?
2. How are stacking rules handled? (Some bonuses stack, some don't — Shadowrun 4e has explicit
   stacking rules for initiative enhancement.)
3. Where should drugs/compounds and matrix mode be modelled — as Items, as a separate field on
   `RunnerData`, or as transient session state?
4. Should active sustained spells be treated as a source of GameEffects the same way gear is?

## Related

- `src/system/gameEffects/gameEffectData.ts` — current effect types
- `src/system/gameEffects/gameEffectType.ts` — effect type enum
- `CONTEXT.md` — `GameEffect` term definition
