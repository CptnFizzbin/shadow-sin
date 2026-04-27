# Initiative & Dice Rolling

Two sequential branches. The dice subsystem lands first as a reusable primitive; the initiative branch consumes it.

---

## Branch 1: `feat/dice-roller` — ✅ Implemented

A generic, reusable d6 rolling subsystem. Shadowrun uses only d6s — all pools, initiative, and nuyen rolls share the same die type.

### Canonical dice functions — `src/system/dice/diceRoll.ts`

| Function | Description |
|---|---|
| `rollD6(): number` | Returns 1–6 |
| `rollDice(count: number): number[]` | Returns array of N d6 results |
| `countHits(results: number[]): number` | Counts values ≥ 5 |
| `countOnes(results: number[]): number` | Counts 1s (glitch indicator) |
| `sumDice(results: number[]): number` | Sums raw pip values |
| `isGlitch(results: number[]): boolean` | True when more than half the dice show 1s |
| `isCriticalGlitch(results: number[]): boolean` | Glitch with zero hits |
| `rollDiceExploding(count: number): number[]` | Rule of Six — each 6 adds an extra die (Push Edge) |
| `rerollMisses(results: number[]): number[]` | Keeps hits, re-rolls non-hits (Second Chance) |

Covered by 36 AAA-structured tests in `src/system/dice/diceRoll.test.ts`.

### Consolidation

- `src/components/system/dice/diceUtils.ts` — re-exports `rollD6` from `diceRoll.ts`; retains `getDiceOffset` with its own `randomIntInRange` (animation-only, not rolling)
- `src/components/system/dice/useDiceRoller.ts` — delegates `countHits`, `isGlitch`, `isCriticalGlitch` to canonical functions
- `"crtical"` → `"critical"` typo fixed in `DiceResultsInfo`, `useDiceRoller`, `DiceResult`

### DiceRollButton — `src/components/dice/diceRollButton.tsx`

Controlled component where the caller owns roll state and persists it to the character sheet. Used by initiative (which needs to save results). Props:

```ts
count: number          // dice pool size
result?: number[]      // current results (undefined = not yet rolled)
onRoll: (results: number[]) => void
onClear?: () => void
label?: string         // defaults to "Roll {count}d6"
displayMode: "sum" | "hits"
```

### DiceTray system

A modal dice tray available app-wide for ad-hoc rolls (weapon attacks, general use).

**`src/components/dice/diceTrayApi.ts` — `DiceTrayApi`**

Class-based stable API object backed by a TanStack `Store<DiceTrayState>`. Methods:

| Method | Description |
|---|---|
| `setDice(count)` | Open tray with N dice; no auto-roll; clears prior results |
| `roll(count)` | Open tray and auto-roll immediately |
| `rollStandard()` | Roll current count; standard d6 |
| `rollEdge()` | Roll current count; exploding 6s (Push the Limit) |
| `rollSecondChance()` | Re-roll all non-hits from current results |
| `setDiceCount(count)` | Adjust count; clears results |
| `close()` | Close dialog; cancels rolling timer |
| `destroy()` | Cancel pending timer on unmount |

Covered by 16 AAA-structured tests in `src/components/dice/diceTrayApi.test.ts`.

**`src/components/dice/diceTrayDialog.tsx`**

- Count adjuster (+/− buttons)
- Animated dice display (randomises faces while `isRolling`)
- Hit count, glitch / critical glitch labels
- **Push Edge** button (before rolling) — spends 1 Edge, calls `rollEdge()`
- **2nd Chance** button (after rolling) — spends 1 Edge, calls `rollSecondChance()`
- **Roll Nd6** and **Close** buttons

**`src/components/dice/diceTrayProvider.tsx`**

Mounts inside `CharacterSheetProvider` (needs edge access). Renders `DiceTrayDialog` as a singleton and exposes `useDiceTray()` hook to any descendant.

**Bottom bar**

`src/routes/$characterId.tsx` adds a dice icon button (`RiDiceLine`) to the sticky bottom bar alongside Quick Access. Calls `diceTray.setDice(1)` — user sets count and rolls manually.

---

## Branch 2: `feat/initiative-roll` — ✅ Implemented

Builds on `feat/dice-roller`. Adds initiative dice rolls, pass tracking, Seize the Initiative, and a CombatHud.

### Initiative formula

```
dicePool = Reaction + Intuition + initiativeBonus + extraInitiativeDice
score    = dicePool + countHits(rolledResults)
```

The full dice pool is rolled (not 1d6). Hits (5–6) are counted and added to the pool value as the initiative score. There is no per-pass score decrement.

### `src/components/system/initiative/useInitiative.ts`

Fixed to use `useGameEffects` so all five effect sources are covered with the correct `equipped`/`sustained` gates:

```ts
interface InitiativeInfo {
  dicePool: number       // Reaction + Intuition + bonuses + extra dice
  initiativePasses: number  // 1 + extraInitiativePasses from effects
}
```

### `CharacterSheet.initiative`

```ts
initiative?: {
  passesCompleted: number[]   // indices of completed initiative passes
  rolledResults?: number[]    // full pool roll results (persisted)
  goingFirst?: boolean        // Seize the Initiative flag
  extraPasses?: number        // edge-purchased extra IPs this round
}
```

### `src/components/system/initiative/initiativePassStore.ts`

`InitiativePassStore extends StoreSlice<InitiativePassState>` — methods:

| Method | Description |
|---|---|
| `togglePass(index)` | Mark/unmark a pass as completed |
| `setRolledResults(results)` | Persist initiative roll to sheet |
| `clearRolledResults()` | Clear roll (undo) |
| `setGoingFirst(value)` | Set/clear the Seize the Initiative flag |
| `gainExtraPass()` | Spend 1 Edge to add +1 IP for the round |
| `resetPasses()` | End Round — clears all five fields |

Covered by 13 AAA-structured tests in `src/components/system/initiative/initiativePassStore.test.ts`.

`useInitiativePassStore.ts` exposes per-field hooks: `useInitiativePassesCompleted`, `useInitiativeRolledResults`, `useInitiativeGoingFirst`, `useInitiativeExtraPasses`.

### InitiativeSection — `src/components/system/initiative/initiativeSection.tsx`

HUD row layout:

```
[Initiative]                              [End Round]
  14   [🎲]  8d6          ●●○  [1st]  [⋮]
```

- **Score** — `dicePool + countHits(rolledResults)`, shown as `"—"` until rolled
- **🎲 dice icon** — calls `diceTray.setDice(dicePool)`; when tray closes, `rolledResults` are persisted to the sheet via `isInitiativeRoll` ref guard
- **Pool caption** — `Nd6`
- **IP dots** — filled circle per completed pass, empty per remaining; count = `basePasses + extraPasses`
- **1st chip** — shows when `goingFirst === true`
- **⋮ popup** — contains:
  - `InitiativePassTracker` (toggle buttons for each pass)
  - **Seize Initiative** button — spends 1 Edge, sets `goingFirst` (or "Going First" chip with undo ×)
  - **Gain IP** button — spends 1 Edge, calls `gainExtraPass()`

### CombatHud — `src/components/character/combat/combatHud.tsx`

Replaces `InitiativeSection` on the Offense tab. Three sections:

**Initiative** — the `InitiativeSection` component described above.

**Wounds** — compact segmented tracks for Physical and Stun damage:
```
P  ■■■■□□□□□  4/9
S  ■■□□□□□□□  2/9
```
Read-only; editing is done via Quick Access panel.

**Status** — chips for active combat modifiers (hidden when nothing is active):
- `Wounds −N` (error colour) — from `useWoundModifier()`
- `Init +N` / `Init −N` — from `useGameEffects(initiativeBonus)`
- `+N IP` — from `useGameEffects(extraInitiativePasses)`
- `+N Init dice` — from `useGameEffects(extraInitiativeDice)`
- Named source chips (info colour) — sustained spells and equipped gear that have effects

### Edge spending summary

| Action | When | Cost | Effect |
|---|---|---|---|
| Push Edge | Dice tray, before rolling | 1 Edge | Re-roll with exploding 6s |
| 2nd Chance | Dice tray, after rolling | 1 Edge | Re-roll all non-hits |
| Seize Initiative | Initiative popup | 1 Edge | Act first this round (`goingFirst = true`) |
| Gain IP | Initiative popup | 1 Edge | +1 initiative pass for the round |

All Edge actions are reversed by the undo mechanism on the Going First chip (×). `resetPasses()` / End Round clears all round state.
