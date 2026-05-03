# Issue 242 — Flexible Spell Drain Base Value

**Status: Implemented** — 336/336 tests passing, lint clean. Ready for PR.

**Suggested PR title:** feat: support flexible spell drain base types (force-based vs. fixed)

---

## Summary

Spell drain previously assumed all spells use `ceil(F/2) + modifier`. SR4e has two distinct drain
base types. This change introduces the `SpellDrainBaseType` enum and also fixes two existing bugs
(wrong rounding direction; form `min` value blocking negative modifiers).

**Rules reference (SR4e Core p. 163):**
- Most spells: base DV = Force ÷ 2 (rounded **down**); final DV = base + spell modifier
- Curative Health spells: base DV = the value of the damage being healed or effect countered
  (not force-dependent); final DV = base + spell modifier
- A spell's DV may never be modified below 1

---

## Bugs fixed

1. `Math.ceil` used for Force/2 — rules specify round **down** (`Math.floor`)
2. Drain modifier form field had `min: 0` — modifiers can be as low as −4 (Zod schema was
   already correct; only the UI input was wrong)

---

## Changes by commit

### Commit 1 — Data model (`src/system/magic/spellData.ts`)
- Added `SpellDrainBaseType` enum: `Force = "Force"` | `Fixed = "Fixed"`
- Added `drainBaseType: SpellDrainBaseType` field (defaults to `Force`; backwards-compatible)
- Added `drainBaseValue?: number` field — only used when `drainBaseType === "Fixed"`
- `drainValueMod: number` unchanged (range −4 to +4 in Zod schema)

### Commit 2 — Rounding fix (`spellDrainFormula.ts`, `spellDrainFormula.test.ts`)
- `Math.ceil(force / 2)` → `Math.floor(force / 2)` in `computeDrainValue`
- Updated rounding test: Force 5 now gives 2 (was 3)

### Commit 3 — Fixed base type support (`spellDrainFormula.ts`, `spellDrainFormula.test.ts`)
- `computeDrainValue` branches on `drainBaseType`: Fixed uses `drainBaseValue`, Force uses `floor(F/2)`
- `formatDrainFormula` signature changed from `(drainValueMod: number)` to `(spell: SpellData)`
  - Force-based: `"F/2+2"` / `"F/2"` / `"F/2-1"`
  - Fixed-base: `"5+2"` / `"3"` / `"5-1"`
- Added Fixed-base test cases; test helpers split into `makeForceSpell` / `makeFixedSpell`

### Commit 4 — Callsite updates
- `drainValue.tsx` — prop changed from `mod: number` to `spell: SpellData`
- `spellViewerListItem.tsx` — updated to pass full spell to `DrainValue`
- `spellCastDialog.tsx` — updated `formatDrainFormula` call to pass full spell

### Commit 5 — Form UI (`spellFormFields.tsx`, `useSpellForm.ts`)
- Added `drainBaseType` select field (Force ÷ 2 / Fixed Value)
- Added `drainBaseValue` number field, conditionally shown via `form.Subscribe` when type is Fixed
- Renamed drain modifier field label to "Drain Modifier"; fixed `min: 0` → `min: -4`
- Added `drainBaseType: SpellDrainBaseType.Force` and `drainBaseValue: undefined` to form defaults

### Commit 6 — Fixture backfill (`hexen.ts`, `useGameEffects.test.tsx`)
- Added `drainBaseType: SpellDrainBaseType.Force` to all 6 spells in `hexen.ts`
- Added same to 2 inline spell objects in `useGameEffects.test.tsx`

---

## Acceptance criteria

- [x] A spell with `drainBaseType: Force` computes drain as `floor(F/2) + mod`, minimum 1
- [x] A spell with `drainBaseType: Fixed` and `drainBaseValue: 4` computes drain as `4 + mod`, minimum 1
- [x] `formatDrainFormula` returns `"F/2+2"` / `"F/2"` / `"F/2-1"` for force-based spells
- [x] `formatDrainFormula` returns `"5+2"` / `"3"` / `"5-1"` for fixed-base spells
- [x] Form drain modifier field accepts negative values down to −4
- [x] Fixed base value field appears only when drain base type is set to Fixed
- [x] All existing spells default to `Force` base type (no data migration required)
- [x] All tests pass; lint clean
