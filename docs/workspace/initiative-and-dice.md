# Initiative & Dice Rolling

Two sequential branches. The dice subsystem lands first as a reusable primitive; the initiative branch consumes it.

---

## Branch 1: `feat/dice-roller` ✅ Implemented

A reusable d6 rolling subsystem plus a global Dice Tray dialog. Shadowrun uses
only d6s — all pools, initiative, and nuyen rolls share the same die type and
the same engine.

### What shipped

The implementation diverged from the original "pure functions + controlled
button" sketch in favour of a stateful, store-backed engine and a globally
mounted tray dialog. This makes the same `DiceRoller` reusable from any
component (skill row, weapon, attribute) without each one owning roll state
or animation logic.

#### Core engine — `src/system/dice/`

- **`diceRoller.ts`** — `DiceRoller` class backed by a TanStack `Store`.
  Chainable API: `addDice`, `removeDice`, `setPoolSize`, `reset`, `rollD6`,
  `rollDie`, `rollDice`, `rollAll`, `rerollOnes`, `rollMisses`. Returns a
  `settled()` promise so callers can await the rolling animation. Supports a
  per-roll `timeout` (animation duration) and an `explodes` option for SR4A's
  Rule of Six (Push the Limit). Manages its own "shimmer" interval while dice
  are mid-roll.
- **`dieState.ts`** — `DieState { value: number | null, isRolling: boolean }`
  with a `SettledDieState` narrowing for post-roll consumers.
- **`diceRoller.state.ts`** — `DiceRollerState { dice: DieState[] }`.
- **`diceRoller.selectors.ts`** — Memoised selectors (via `reselect`) and a
  `useDiceRollerSelector` hook: `selectAllDice`, `selectSettledDice`,
  `selectAllSettled`, `selectIsRolling`, `selectWasRolled`, `selectHits`,
  `selectIsGlitch`, `selectIsCriticalGlitch`, `selectRollState`. Replaces the
  ad-hoc `countHits` / `sumDice` / `isGlitch` helpers from the original plan.
- **`rollState.ts`** — `RollState` enum (`Assembling`, `Rolling`, `Critical`,
  `Glitch`, `Hit`, `Miss`) — drives the dialog's result label.
- **`diceRoller.test.ts`** — Comprehensive `vi.useFakeTimers`-driven coverage,
  including exploding 6s and glitch / critical-glitch detection.

`sumDice` (initiative pip totals) is not yet implemented as a selector — it'll
be a one-liner over `selectSettledDice` when Branch 2 needs it.

#### Dice Tray UI — `src/components/dice/`

- **`DiceTrayApi`** — Stable, store-backed orchestrator that owns the dialog
  state (`open`, `edgeSpent`, `threshold`) plus a `DiceRoller` instance.
  Public surface:
  - `setDice(count)` — open pre-loaded, no roll
  - `roll(count?)` — open and immediately roll
  - `setThreshold`, `rollStandard`, `rollEdge(maxEdge)` (Push the Limit),
    `rerollMisses` (Second Chance), `reset`, `open`, `close`
  - `edgeSpent` gate ensures Edge can only be spent once per session
- **`DiceTrayProvider`** + **`useDiceTray`** — React context that also renders
  the `DiceTrayDialog` once per provider. Mounted *inside*
  `CharacterSheetProvider` so the dialog can read/write edge state.
- **`DiceTrayDialog`** — Full roll UI: dice & threshold counters, animated
  dice display, hits / glitch / critical-glitch / success label, Edge controls
  (Reroll Misses, Roll Edge), Reset / Roll / Close.
- **`DiceRollButton`** — Drop-in `IconButton` (remix `RiDiceLine`) accepting
  `poolSize` and `autoRoll`. Calls `setDice` or `roll` on the tray. Replaces
  the originally-planned "controlled button with onRoll/onClear callbacks" —
  state lives in the shared tray, not at every call site.
- **`DiceFace`** — Small MUI `Chip` rendering one die value (hits / 1s
  highlighted). Currently unused; included as a primitive for future
  consumers.

#### Route wiring — `src/routes/$characterId.tsx`

Constructs a `DiceTrayApi` (memoised per route mount) and wraps content in
`<DiceTrayProvider>`. The bottom action bar now contains a `ButtonGroup` with
the renamed `QuickAccessButton` and a new "Dice Tray" button.

#### Consumer migration

- `useDiceRoller(numDice)` — Now returns a memoised `DiceRoller` instance
  directly, not a `[results, rollDice]` tuple.
- `DiceResult` — Switched from a `DiceResultsInfo` prop to a
  `roller: DiceRoller` prop; subscribes via `useDiceRollerSelector` and owns
  its own animation.
- `DieIcon` — Accepts `value: number | null` and an optional `size` prop.
- `StartingNuyenSection` — Migrated to the new `useDiceRoller` shape (the
  follow-up cleanup originally listed under "Notes" — done).
- `NumberUtils.randomIntInRange` added; `EdgeStore` and `getDiceOffset` now
  use it.

### Deviations from the original plan

| Original plan                                        | What shipped                                                            |
| ---------------------------------------------------- | ----------------------------------------------------------------------- |
| `diceRoll.ts` with pure functions                    | `DiceRoller` class + TanStack `Store` + `reselect` selectors            |
| `DiceRollButton` is fully controlled (caller owns state, `onRoll`/`onClear` callbacks) | `DiceRollButton` is an `IconButton` that delegates to a global `DiceTrayApi` |
| No persistence / dialog at this layer                | Global `DiceTrayDialog` mounted via `DiceTrayProvider`                  |
| `StartingNuyenSection` migration deferred            | Migrated in this branch                                                 |

The "no character sheet coupling" goal still holds for `DiceRoller` itself —
the dialog reads edge state, but the engine is sheet-agnostic.

### Follow-ups

- Wire `DiceRollButton` into skill / attribute / weapon rows so any pool can
  open the tray pre-loaded
- `selectSumOfPips` selector for initiative pip totals (needed by Branch 2)

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
- Use `DiceRollButton` (from Branch 1) — wired through `DiceTrayApi.roll(1)`,
  reading the result back via `roller.settled()` then writing to
  `initiative.rolledScore`. (The original plan had `count={1}` /
  `displayMode="sum"` props on a fully-controlled button; with the tray-based
  API the caller awaits `settled()` and reads `selectSettledDice` instead.)
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

## Todo — Branch 1: `feat/dice-roller` ✅

- [x] `src/system/dice/diceRoller.ts` — `DiceRoller` class (replaces pure
      `diceRoll.ts` plan)
- [x] `src/system/dice/dieState.ts`, `rollState.ts`, `diceRoller.state.ts`
- [x] `src/system/dice/diceRoller.selectors.ts` — hits, glitch, critical
      glitch, roll state, settled dice
- [x] `src/components/dice/diceFace.tsx`
- [x] `src/components/dice/diceRollButton.tsx`
- [x] `src/components/dice/diceTrayApi.ts` (new — globally-mounted tray)
- [x] `src/components/dice/diceTrayDialog.tsx`
- [x] `src/components/dice/diceTrayProvider.tsx` (+ `useDiceTray`)
- [x] `src/system/dice/diceRoller.test.ts` — engine + selector coverage
- [x] `StartingNuyenSection` migrated to `DiceRoller`

## Todo — Branch 2: `feat/initiative-roll`

- [ ] Fix `useInitiative.ts` — switch to `useGameEffects`
- [ ] Add `sustained` to `SpellData` + `SpellDataSchema`
- [ ] Gate spell effects in `useGameEffects.ts` on `spell.sustained === true`
- [ ] Add Sustained toggle to `SpellItemCard` (only when spell has effects)
- [ ] Migration: `20260426_addSpellSustained.ts`
- [ ] Add `rolledScore` to `CharacterSheet.initiative`
- [ ] Migration: `20260426_addInitiativeRolledScore.ts`
- [ ] Expand `InitiativeInfo` — `baseScore`, `rolledScore`, `currentScore`
- [ ] Update `InitiativeSection` — wire to `DiceTrayApi`, per-pass score decrement
- [ ] Update `docs/features/gameplay.md` — mark completed initiative items
