# Initiative & Dice Rolling

Two sequential branches. The dice subsystem lands first as a reusable primitive; the initiative branch consumes it.

---

## Branch 1: `feat/dice-roller`

A generic, reusable d6 rolling subsystem. Shadowrun uses only d6s — all pools, initiative, and nuyen rolls share the same die type.

### Goals
- Generic hook and display component for rolling Nd6
- Pure presentational: no character sheet coupling
- Supports both pool rolls (sum of hits: 5–6) and flat rolls (sum of pips, for initiative)

### New Files

**`src/system/dice/diceRoll.ts`**
- `rollD6(): number` — returns 1–6
- `rollDice(count: number): number[]` — returns array of N results
- `countHits(results: number[]): number` — counts values ≥ 5
- `countOnes(results: number[]): number` — counts 1s (glitch indicator)
- `sumDice(results: number[]): number` — sums raw pip values (for initiative)
- `isGlitch(results: number[]): boolean` — more than half the dice show 1s
- `isCriticalGlitch(results: number[]): boolean` — glitch with zero hits
- `rollDiceExploding(count: number): number[]` — Rule of Six: each 6 adds an extra die (Edge before roll)
- `rerollMisses(results: number[]): number[]` — keeps hits, re-rolls non-hits (Edge after roll)

**`src/components/dice/DiceRollButton.tsx`**
```
Props:
  count: number         — number of dice to roll
  result?: number[]     — current rolled results (undefined = not yet rolled)
  onRoll: (results: number[]) => void
  onClear?: () => void
  label?: string        — button label, defaults to "Roll {count}d6"
  displayMode: "sum" | "hits"
  onEdgeBefore?: (results: number[]) => void   — Push the Limit: exploding 6s
  onSecondChance?: (results: number[]) => void — Second Chance: re-roll misses
```
- Before roll: shows Roll button + optional "Edge" button (Push the Limit)
- After roll: shows die faces (hits=accent, 1s=error) + value + glitch label + optional "2nd Chance" button
- Caller owns state and is responsible for spending the Edge point

**`src/components/dice/DiceFace.tsx`**
- Small MUI chip or icon showing a single d6 value (1–6)
- Hits (5–6) rendered in accent colour for visual feedback

### Notes
- `StartingNuyenSection` in the builder already has an ad-hoc dice roller. This subsystem does not replace it yet — that's a follow-up cleanup task.
- No persistence at this layer. Components are fully controlled (caller owns `result` state).

---

## Branch 2: `feat/initiative-roll`

Builds on `feat/dice-roller`. Adds initiative dice rolls, per-pass score decrement, and spell-based modifiers (Increase Reflexes, Synaptic Booster, etc.).

### Goals
1. Fix `useInitiative` bug — gear equipped-check missing, spells ignored
2. Add `sustained` toggle to spells so spell effects gate on active casting
3. Roll 1d6 and persist `initiative.rolledScore` on the character sheet
4. Display running score: `base + roll − (10 × passesCompleted)`
5. "End Round" clears both `passesCompleted` and `rolledScore`

---

### 2.1 — Fix `useInitiative.ts` (bug fix)

**File:** `src/components/system/initiative/useInitiative.ts`

Current code manually collects effects from gear, qualities, adeptPowers — skipping spells, complexForms, and the `equipped` check on gear. Replace with `useGameEffects`:

```ts
// Before
const allEffects = useCharacterSheet((sheet) => [
  ...Object.values(sheet.gear).flatMap((item) => item.effects ?? []),   // ← no equipped check
  ...sheet.qualities.flatMap((q) => q.effects ?? []),
  ...sheet.adeptPowers.flatMap((p) => p.effects ?? []),
  // ← spells missing entirely
])

// After
const initiativeBonuses = useGameEffects(GameEffectType.initiativeBonus)
const extraPassEffects   = useGameEffects(GameEffectType.extraInitiativePasses)
```

`useGameEffects` already handles all five sources with the correct `equipped` gate on gear.

---

### 2.2 — `sustained` flag on spells

SR4A spells like Increase Reflexes are sustained — their effects apply only while the mage concentrates. Gear has `equipped` for this purpose; spells need an equivalent.

**`src/system/magic/spellData.ts`**
- Add `sustained?: boolean` to `SpellData` interface
- Add `sustained: z.boolean().optional()` to `SpellDataSchema`

**`src/components/system/gameEffects/useGameEffects.ts`**
- Change spell loop: `if (spell.effects && spell.sustained === true)`

**`src/components/character/spells/spiritItemCard.tsx`** → `spellItemCard.tsx`
- Show a "Sustained" toggle chip only on spells that have `effects` defined
- Saves `{ ...spell, sustained: !spell.sustained }` via the spells store

**Migration: `src/character/migrations/20260426_addSpellSustained.ts`**
- Ensures `sustained` is absent (undefined = not sustained) — no transform needed, schema default handles it

---

### 2.3 — Persist `rolledScore` on character sheet

**`src/system/characterSheet.ts`**
```ts
initiative?: {
  passesCompleted: number[]
  rolledScore?: number      // ← new
}
```

**Migration: `src/character/migrations/20260426_addInitiativeRolledScore.ts`**
- If `initiative` exists, set `rolledScore = undefined` (no-op; just marks migration applied)

---

### 2.4 — Initiative UI changes

**`src/components/system/initiative/useInitiative.ts`**

Expose `rolledScore` and derived `currentScore`:
```ts
interface InitiativeInfo {
  baseScore: number         // reaction + intuition + bonuses
  rolledScore?: number      // persisted 1d6 result
  initiativeScore: number   // baseScore + (rolledScore ?? 0)
  currentScore: number      // initiativeScore − (10 × passesCompleted.length)
  initiativePasses: number
}
```

**`src/components/system/initiative/initiativeSection.tsx`**

Layout changes:
- Replace `InitiativeScoreDisplay` with a two-line display:
  - Line 1: `Base: {baseScore}` (dimmed)
  - Line 2: `Init: {initiativeScore}` (prominent) or `{baseScore} + {roll} = {initiativeScore}`
- Use `DiceRollButton` (from Branch 1) with `count={1}` and `displayMode="sum"`
- `onRoll`: save result to `initiative.rolledScore` via `useCharacterSheetStore`
- `onClear`: clear `initiative.rolledScore`
- `InitiativePassTracker` shows `currentScore` as each pass is taken
- "End Round" clears both `passesCompleted` and `rolledScore`

---

### Spell modifier example — Increase Reflexes

No special-casing needed. User adds the spell to their list:
```
Name: Increase Reflexes
Category: Health / Duration: Sustained
Effects:
  initiativeBonus        value: +2
  extraInitiativePasses  value: +1
```
Toggle Sustained → initiative score and pass count update live.

---

---

## Branch 2 addition: Seize the Initiative (Edge spend)

SR4A p. 166 — A character may spend 1 Edge at the start of a combat turn to act first in the initiative order, regardless of rolled score. Resets at End Round like `passesCompleted` and `rolledScore`.

### State changes

**`CharacterSheet.initiative`**
```ts
initiative?: {
  passesCompleted: number[]
  rolledScore?: number
  goingFirst?: boolean    // ← new
}
```
No migration needed — field is optional; undefined = not active.

**`InitiativePassState`** (in `initiativePassStore.ts`)
```ts
interface InitiativePassState {
  passesCompleted: number[]
  rolledScore?: number
  goingFirst?: boolean    // ← new
}
```

**`InitiativePassStore`** — add one method:
```ts
setGoingFirst(value: boolean): void
```
`resetPasses()` already clears the whole state — add `goingFirst = undefined` there.

**`useInitiativePassStore.ts`** — expand slice selector/updater to include `goingFirst`.

Add `useInitiativeGoingFirst(store)` hook alongside the existing `useInitiativeRolledScore`.

### UI changes — `initiativeSection.tsx`

Add `useEdgeStore()` to read current edge count.

**When `goingFirst` is false/undefined:**
- Show "Seize Initiative" button (warning colour, small)
- Button label: `Seize Initiative (Edge: {current})`
- Disabled when `edge.current === 0`
- On click: `edgeStore.setCurrent(current - 1)` + `initiativePassStore.setGoingFirst(true)`
- No confirm dialog — consistent with how the quick panel lets you freely adjust edge

**When `goingFirst` is true:**
- Replace button with a filled "Going First" chip (warning/accent colour)
- Chip has a dismiss (×) icon that refunds 1 edge and clears the flag (mis-click correction)

### Files to change

| File | Change |
|---|---|
| `src/system/characterSheet.ts` | Add `goingFirst?: boolean` to `initiative` |
| `src/components/system/initiative/initiativePassStore.ts` | Add `goingFirst` to state + `setGoingFirst` + clear in `resetPasses` |
| `src/components/system/initiative/useInitiativePassStore.ts` | Include `goingFirst` in slice; add `useInitiativeGoingFirst` hook |
| `src/components/system/initiative/initiativeSection.tsx` | Add `useEdgeStore`, Seize Initiative button / Going First chip |

---

## Todo — Branch 1: `feat/dice-roller`

- [ ] `src/system/dice/diceRoll.ts` — `rollD6`, `rollDice`, `countHits`, `sumDice`
- [ ] `src/components/dice/DiceFace.tsx` — single die display chip
- [ ] `src/components/dice/DiceRollButton.tsx` — controlled roll button + result display
- [ ] Unit tests: `src/system/dice/diceRoll.test.ts` — pure function coverage including glitch detection and edge mechanics

## Todo — Branch 2: `feat/initiative-roll`

- [ ] Fix `useInitiative.ts` — switch to `useGameEffects`
- [ ] Add `sustained` to `SpellData` + `SpellDataSchema`
- [ ] Gate spell effects in `useGameEffects.ts` on `spell.sustained === true`
- [ ] Add Sustained toggle to `SpellItemCard` (only when spell has effects)
- [ ] Migration: `20260426_addSpellSustained.ts`
- [ ] Add `rolledScore` to `CharacterSheet.initiative`
- [ ] Migration: `20260426_addInitiativeRolledScore.ts`
- [ ] Expand `InitiativeInfo` — `baseScore`, `rolledScore`, `currentScore`
- [ ] Update `InitiativeSection` — `DiceRollButton`, per-pass score decrement
- [ ] Update `docs/features/gameplay.md` — mark completed initiative items

## Todo — Branch 2 addition: Seize the Initiative

- [ ] Add `goingFirst?: boolean` to `CharacterSheet.initiative`
- [ ] Add `goingFirst` to `InitiativePassState` + `setGoingFirst` method + clear in `resetPasses`
- [ ] Expand slice selector/updater in `useInitiativePassStore.ts`; add `useInitiativeGoingFirst` hook
- [ ] Add Seize Initiative button / Going First chip to `InitiativeSection`
