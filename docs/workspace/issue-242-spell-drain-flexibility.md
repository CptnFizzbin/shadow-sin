# Issue 242 — Flexible Spell Drain Base Value

PR ticket draft for GitButler. Copy the title and body block into the GitHub issue / PR description.

---

**Suggested title:** feat: support flexible spell drain base types (force-based vs. fixed)

```md
## Summary

Spell drain currently assumes all spells use `ceil(F/2) + modifier` as the drain value. SR4e has
two distinct drain base types and the current form also contains a rounding bug and a UI validation
bug on the modifier field.

**Rules reference (SR4e Core p. 163):**
- Most spells: base DV = Force ÷ 2 (rounded **down**); final DV = base + spell modifier
- Curative Health spells: base DV = the value of the damage being healed or effect countered
  (not force-dependent); final DV = base + spell modifier
- A spell's DV may never be modified below 1

## Bugs being fixed

1. `Math.ceil` used for Force/2 — rules specify round **down** (`Math.floor`)
2. Drain modifier form field has `min: 0` — modifiers can be as low as −4 (Zod schema is
   already correct; only the UI input is wrong)

## Data model changes

`src/system/magic/spellData.ts`

- Add `SpellDrainBaseType` enum: `Force = "Force"` | `Fixed = "Fixed"`
- Add `drainBaseType: SpellDrainBaseType` field (defaults to `Force`; all existing spells are
  force-based so this is backwards-compatible)
- Add `drainBaseValue?: number` field — only meaningful when `drainBaseType === "Fixed"`;
  stores the fixed base amount (e.g. the damage level being healed)
- `drainValueMod: number` stays unchanged (the cumulative modifier, range −4 to +4)

## Logic changes

`src/components/character/spells/spellDrainFormula.ts`

- `computeDrainValue(force, spell)` — branch on `drainBaseType`:
  - `Force`: `base = Math.floor(force / 2)` ← fixes ceil → floor
  - `Fixed`: `base = spell.drainBaseValue ?? 0`
  - result: `Math.max(1, base + spell.drainValueMod)`
- `formatDrainFormula` — signature changes from `(drainValueMod: number)` to `(spell: SpellData)`
  so it has the base type context; display examples:
  - Force-based, mod +2 → `"F/2+2"`
  - Force-based, no mod → `"F/2"`
  - Fixed base 5, mod −1 → `"5-1"`
  - Fixed base 3, no mod → `"3"`

## UI / form changes

`src/components/character/spells/form/spellFormFields.tsx`

- Fix drain modifier field: `min: 0` → `min: -4`
- Add `drainBaseType` toggle/select (Force / Fixed)
- Conditionally show `drainBaseValue` number input when type is Fixed

`src/components/character/spells/form/useSpellForm.ts`

- Add `drainBaseType: SpellDrainBaseType.Force` and `drainBaseValue: undefined` to default
  values

## Callsite updates

- `drainValue.tsx` — pass full `spell` object to `formatDrainFormula`
- `spellCastDialog.tsx` — same
- `spellDrainFormula.test.ts` — update tests for new signature; add Fixed-base cases; update
  rounding test (Force 5: was 3, now 2)
- `src/character/fixtures/hexen.ts` (and any other fixture files) — add
  `drainBaseType: SpellDrainBaseType.Force` to all existing spell entries

## Acceptance criteria

- [ ] A spell with `drainBaseType: Force` computes drain as `floor(F/2) + mod`, minimum 1
- [ ] A spell with `drainBaseType: Fixed` and `drainBaseValue: 4` computes drain as `4 + mod`,
      minimum 1
- [ ] `formatDrainFormula` returns `"F/2+2"` / `"F/2"` / `"F/2-1"` for force-based spells
- [ ] `formatDrainFormula` returns `"5+2"` / `"3"` / `"5-1"` for fixed-base spells
- [ ] Form drain modifier field accepts negative values down to −4
- [ ] Fixed base value field appears only when drain base type is set to Fixed
- [ ] All existing spells default to `Force` base type (no data migration required)
- [ ] All tests pass; lint clean
```
