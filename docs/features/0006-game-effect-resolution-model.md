# GameEffect Resolution Model

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

`GameEffect` entries can be attached to Items, Qualities, Spells, and other sources. There is
currently no canonical layer that aggregates all active effects and applies them to derived stats.
Components appear to resolve effects ad-hoc via selector hooks, but this has not been
standardised. This design must be settled before building further GameEffect-consuming features.

**Known sources of GameEffects** — multiple sources can affect the same derived stat:

| Source | Examples |
|---|---|
| Gear | Cyberware (Wired Reflexes), weapons, armor |
| Adept Powers | Increased Reflexes |
| Spells (sustained) | Increase Reflexes |
| Qualities | High Pain Tolerance, Low Pain Tolerance |
| Drugs / Compounds | _(not yet modelled)_ |
| Matrix connection mode | AR vs. Hot-sim VR vs. Cold-sim VR |
| Others (potential) | Critter powers, mentor spirits |

## Open Questions

- [ ] Is there a centralised "apply effects" selector, or is it purely ad-hoc per component?
- [ ] How are stacking rules handled? SR4e has explicit rules for what stacks — e.g. initiative
      enhancement bonuses from different sources.
- [ ] Where are drugs/compounds and matrix connection mode modelled — as Items, a separate field
      on `RunnerData`, or transient Session State?
- [ ] Should active sustained spells be treated as a source of GameEffects the same way gear is?

## Constraints

- SR4e stacking rules are not fully permissive — some bonuses from the same category do not
  stack; the resolution model must be able to express this.
- `GameEffectData` entries are currently attached to Items; the model must accommodate
  non-Item sources (qualities, sustained spells) without breaking existing Item-attached effects.
- This design blocks or significantly shapes: Matrix Programs dice pools, Entity StatusSheets
  (Vehicle/Drone effects), and any future feature that reads derived stats.

## Domain Notes

- **GameEffect** — a mechanical modifier that changes a derived stat; can originate from many
  sources
- **Dice Pool** — assembled from Attribute + Skill + active GameEffect modifiers
- **Wound Modifier** — dice pool penalty derived from filled damage boxes; already implemented
  separately in `damageUtils.ts`

## Out of Scope

- Non-mechanical effects (flavour, narrative modifiers)
- Full drug/compound system — only ensuring the resolution model can accommodate it as a future
  source

## Related Features

- [`docs/features/0005-matrix-programs.md`](./0005-matrix-programs.md) — Program ratings feeding
  into dice pools
- [`docs/features/0008-entity-status-sheets.md`](./0008-entity-status-sheets.md) — Vehicle/Drone
  effects may feed into this model
