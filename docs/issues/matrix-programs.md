# Matrix Programs & Matrix Tests

## Status

Open — Programs exist as Items but loaded program tracking and matrix test dice pools are not
yet implemented.

## Background

In Shadowrun 4e, matrix tests use the same structure as physical skill tests:

```
Physical test:  Attribute + Skill
Matrix test:    Commlink Stat + Program
```

A **Commlink** (stored as `ItemType.device`) has four hardware stats: Response, System,
Firewall, and Signal. **Programs** (stored as `ItemType.program`) are loaded onto the Commlink
up to a limit determined by its System rating. A Program's rating contributes to the dice pool
for the associated matrix action (e.g. `Response + Analyze` for perception-style matrix tests).

## Current State

- Programs are stored as Items in `RunnerData.gear` with `ItemType.program`
- There is no model for "loaded" vs "installed but not loaded" programs
- No matrix test dice pool calculation exists
- `ItemType.software` also exists — the distinction from `ItemType.program` is unclear

## Design Questions

1. **Loaded vs installed** — is a Program an Attachment on a Commlink (using the parent/child
   system), or does the Commlink have a separate `loadedProgramIds` field?
2. **Program slots** — the number of concurrently loaded programs is limited by System rating.
   Is this enforced in the Builder, the Viewer, or both?
3. **`ItemType.software` vs `ItemType.program`** — what is the intended distinction? Is
   `software` the broader category (OS, utilities) while `program` is the matrix-test-relevant
   subset, or are they synonyms that should be merged?
4. **Technomancer complex forms vs programs** — Technomancers use Complex Forms in place of
   Programs; do they share the same `Matrix Test` dice pool structure?
5. **Matrix test UI** — where does a Player roll a matrix test? On the Commlink's StatusSheet,
   or inline on the main Viewer?
6. **GameEffect integration** — should Program ratings feed into the GameEffect system as
   `dicePoolMod` entries, or does the matrix test system get its own resolver?

## Related

- `src/system/itemType.ts` — `ItemType.device`, `ItemType.program`, `ItemType.software`
- `src/system/magic/complexFormData.ts` — Technomancer Complex Forms
- `CONTEXT.md` — Commlink, Program, Matrix Test term definitions
- `docs/issues/entity-status-sheets.md` — Commlink StatusSheet (matrix damage track)
- `docs/issues/game-effect-resolution-model.md` — how Program ratings feed into dice pools
