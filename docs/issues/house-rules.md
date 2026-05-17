# Plan: House Rules / Optional Rules System

## Context

Shadow-sin needs a way for users to opt into optional Shadowrun 4e rules or house rules that alter game mechanics. Design decisions from grilling:

- **Per-character storage** — house rules live on `CharacterSheet`; different characters can represent different campaigns
- **GM as defaults** — a `GameConfig` (YAML, matching character export format) sets campaign baselines; character settings override them
- **Three-layer merge at runtime**: `{ ...sr4eDefaults, ...gmConfig.houseRules, ...character.houseRules }`
- **`GameConfigProvider` at app root** — provides the global GM config to all character hooks via React context
- **Settings tab on each character** — the only UI surface; houses both GM config import/export and character-level toggles
- **Labeled source badges** — each toggle shows where its current value comes from: "SR4e", "GM", or "You"
- **First batch: combat rules only** — `woundModifierInterval: 3 | 4` and `encumbranceEnabled: boolean`
- **`GameConfig` is a future-proof stub** — `{ name: string, houseRules: Partial<HouseRules> }` aligns with the planned GM Game feature (`docs/issues/gm-game.md`)

---

## Phase 1: Types & Data Model

### 1. New file: `src/system/houseRules.ts`

```ts
export interface HouseRules {
  woundModifierInterval: 3 | 4   // SR4e default: 3
  encumbranceEnabled: boolean     // SR4e default: true
}

export const defaultHouseRules: HouseRules = {
  woundModifierInterval: 3,
  encumbranceEnabled: true,
}
```

`woundModifierInterval` uses a literal union so the UI renders exactly two options and TypeScript can exhaustively check it.

### 2. New file: `src/system/gameConfig.ts`

```ts
import type { HouseRules } from "./houseRules.ts"

export interface GameConfig {
  name: string
  houseRules: Partial<HouseRules>
}

export const defaultGameConfig: GameConfig = {
  name: "",
  houseRules: {},
}
```

`Partial<HouseRules>` — the GM only specifies rules that differ from SR4e defaults. An empty `{}` means "run stock SR4e." Future fields (campaign metadata, allowed gear lists) slot in here when the GM Game feature ships.

### 3. Update `src/system/characterSheet.ts`

```ts
import type { HouseRules } from "./houseRules.ts"

export interface CharacterSheet {
  // ... existing fields ...
  houseRules?: HouseRules   // optional so pre-migration characters remain valid
}
```

### 4. Update `src/components/character/sheet/createDefaultCharacterSheet.ts`

New characters mark all migrations as applied via `[...migrationIds]` and never run the migration — the field must be set here too:

```ts
import { defaultHouseRules } from "#/system/houseRules.ts"

// inside return object:
houseRules: { ...defaultHouseRules },
```

---

## Phase 2: Migration

### 5. New file: `src/character/migrations/20260517_addHouseRules.ts`

```ts
import { produce } from "immer"
import type { CharacterMigration } from "#/character/characterMigration.ts"
import { defaultHouseRules } from "#/system/houseRules.ts"

const migration: CharacterMigration<{ houseRules?: object }> = {
  id: "20260517",
  up: produce((draft) => {
    draft.houseRules ??= { ...defaultHouseRules }
  }),
}
export default migration
```

Register in `src/character/migrations.ts` by appending the `await import(...)` line.

---

## Phase 3: GameConfig Storage & Provider

### 6. New file: `src/lib/gameConfig/gameConfigStorage.ts`

Thin wrapper over the existing `AsyncJsonStorage` layer, storing at key `game-config`:

```ts
export async function loadGameConfig(storage: AsyncJsonStorage): Promise<GameConfig>
export async function saveGameConfig(storage: AsyncJsonStorage, config: GameConfig): Promise<void>
```

Uses the same `storageSource` the app already has — no new storage primitives.

### 7. New file: `src/lib/gameConfig/gameConfigYaml.ts`

Matches the pattern in `src/components/character/exportImport/exportUtils.ts`:

```ts
import jsYaml from "js-yaml"

export function gameConfigToYaml(config: GameConfig): string
export function yamlToGameConfig(yaml: string): GameConfig
```

Both use `jsYaml.dump` / `jsYaml.load` directly. No migration pipeline needed — `GameConfig` is simpler than `CharacterSheet`.

### 8. New file: `src/components/gameConfig/GameConfigProvider.tsx`

Context provider mounted at the app root. Reads from storage on mount, exposes config + setter:

```ts
interface GameConfigContextValue {
  config: GameConfig
  setConfig: (config: GameConfig) => void
}

export const GameConfigContext = createContext<GameConfigContextValue>(...)
export const GameConfigProvider: FC<{ children: ReactNode }>
export const useGameConfig = (): GameConfigContextValue
```

Mount location: `src/routes/__root.tsx` (or wherever the app root provider tree lives — check the root route file). Wraps the entire app so every character route has access.

---

## Phase 4: Character House Rules Store

### 9. New files under `src/components/character/houseRules/`

**`houseRulesStore.ts`** — `StoreSlice<HouseRules>` subclass:

```ts
export class HouseRulesStore extends StoreSlice<HouseRules> {
  setRule<K extends keyof HouseRules>(key: K, value: HouseRules[K]): void {
    this.set((prev) => ({ ...prev, [key]: value }))
  }
  reset(gmConfig: Partial<HouseRules>): void {
    this.set({ ...defaultHouseRules, ...gmConfig })
  }
}
```

**`useHouseRulesStore.ts`** — `createSliceAtom` + `useMemo`, performing the 3-way merge in the selector:

```ts
export const useHouseRulesStore = (): HouseRulesStore => {
  const store = useCharacterSheetContext()
  const { config: gmConfig } = useGameConfig()

  return useMemo(() => {
    const atom = createSliceAtom(
      store,
      (root) => ({
        ...defaultHouseRules,
        ...gmConfig.houseRules,
        ...(root.houseRules ?? {}),
      }),
      (root, houseRules) => produce(root, (draft) => {
        draft.houseRules = houseRules
      }),
    )
    return new HouseRulesStore(atom)
  }, [store, gmConfig])
}
```

The selector spread is the core: SR4e defaults → GM overrides → character overrides. Any future rule added to `HouseRules` + `defaultHouseRules` is automatically available without a new migration.

**`useHouseRules.ts`** — convenience read hook:

```ts
export function useHouseRule<K extends keyof HouseRules>(key: K): HouseRules[K] {
  const store = useHouseRulesStore()
  return useSelector(store, (state) => state[key])
}
```

**`houseRuleSource.ts`** — utility to determine badge label for the UI:

```ts
export type HouseRuleSource = "sr4e" | "gm" | "you"

export function getHouseRuleSource<K extends keyof HouseRules>(
  key: K,
  characterRules: Partial<HouseRules> | undefined,
  gmRules: Partial<HouseRules>,
): HouseRuleSource {
  if (characterRules?.[key] !== undefined) return "you"
  if (gmRules[key] !== undefined) return "gm"
  return "sr4e"
}
```

---

## Phase 5: Wire into Calculation Logic

### 10. `src/components/system/damage/damageUtils.ts` — `selectWoundInterval`

Replace hardcoded `const baseInterval = 3`:

```ts
export function selectWoundInterval(track: DamageTrackKey) {
  return (sheet: CharacterSheet): number => {
    const baseInterval = sheet.houseRules?.woundModifierInterval ?? 3
    return Math.max(1, baseInterval + selectLowPainToleranceModifier(track)(sheet))
  }
}
```

`selectWoundInterval` already receives the full `CharacterSheet`, so no hook threading is needed — it reads `sheet.houseRules` directly.

### 11. `src/components/system/encumbrance/useEncumbrance.ts`

Gate the penalty on the rule, returning `penalty: 0` and `isEncumbered: false` when disabled:

```ts
const encumbranceEnabled = useHouseRule("encumbranceEnabled")

// early return after computing totals/threshold but before penalty:
if (!encumbranceEnabled) {
  return { totalBallistic, totalImpact, threshold, penalty: 0, isEncumbered: false }
}
```

The pure `calculateEncumbrancePenalty()` in `src/system/gear/encumbranceUtils.ts` stays unchanged.

---

## Phase 6: UI

### 12. Add Settings section to `src/components/character/characterSections.ts`

Add `settings = "settings"` to the `SectionKey` enum and a new entry:

```ts
[SectionKey.settings]: {
  id: SectionKey.settings,
  label: "Settings",
  route: SettingsRoute,
},
```

No `visibleFor` — always shown for every character.

### 13. New route: `src/routes/$characterId/settings.tsx`

`createFileRoute("/$characterId/settings")` rendering `<HouseRulesSection />`.

### 14. New components under `src/components/character/houseRules/`

**`houseRulesSection.tsx`** — top-level section, analogous to `karmaSection.tsx`:

```
HouseRulesSection
  ── "Campaign Rules" subsection ─────────────────
  GameConfigCard (shows config name + import/export buttons)

  ── "House Rules" subsection ────────────────────
  HouseRuleIntervalSelect  (woundModifierInterval)
  HouseRuleSwitch          (encumbranceEnabled)

  Button: "Reset to SR4e Defaults" → store.reset(gmConfig.houseRules)
```

**`gameConfigCard.tsx`** — reads from `useGameConfig()`. Shows `config.name` (or "No campaign config loaded"), Import button (file picker → `yamlToGameConfig` → `setConfig`), Export button (`gameConfigToYaml` → `downloadTextFile`).

**`houseRuleSwitch.tsx`** — wraps MUI `FormControlLabel + Switch`. Props: `ruleKey` (boolean keys of `HouseRules` only, via conditional mapped type), `label`, optional `description`. Calls `store.setRule(ruleKey, checked)` on change. Renders a `<HouseRuleSourceBadge source={...} />` next to the label.

**`houseRuleIntervalSelect.tsx`** — for `woundModifierInterval`. Uses MUI `ToggleButtonGroup` with buttons "3 (Core)" and "4 (House Rule)". Same badge.

**`houseRuleSourceBadge.tsx`** — small MUI `Chip` with label "SR4e" / "GM" / "You" and a distinct color per source (neutral / primary / secondary). Reads source via `getHouseRuleSource(key, character.houseRules, gmConfig.houseRules)`.

---

## Phase 7: Tests

### Migration test: `src/character/migrations/20260517_addHouseRules.test.ts`
- Adds `houseRules` with all defaults when field is absent
- Preserves existing `houseRules` (idempotency)
- Does not mutate the input

### Calculation tests
- `damageUtils.test.ts` — `selectWoundInterval` with `woundModifierInterval: 4` returns interval 4; stacks correctly with LPT
- `useEncumbrance.test.ts` — when `encumbranceEnabled: false`, penalty is 0 regardless of armor

### GameConfig YAML round-trip
- `gameConfigYaml.test.ts` — `gameConfigToYaml` → `yamlToGameConfig` preserves `name` and `houseRules`

---

## Extensibility: Adding a Future Rule

1. Add key + type to `HouseRules` in `houseRules.ts`
2. Add SR4e default to `defaultHouseRules`
3. No migration needed — the `useHouseRulesStore` selector spreads `defaultHouseRules` first
4. Use `useHouseRule("newKey")` at the calculation site
5. Add a toggle/select + badge to `houseRulesSection.tsx`
6. Add a test for default and overridden behavior

---

## Verification

1. `npx tsc --noEmit` clean
2. `npx vitest run` — migration, calculation, and YAML round-trip tests pass
3. **Manual — new character**: Settings tab visible → all rules show "SR4e" badge → toggle wound interval to 4 → badge changes to "You" → Defense screen wound modifier reflects new interval
4. **Manual — GM config**: Export a GameConfig YAML → re-import it → rules set by GM show "GM" badge → character override shows "You" badge → "Reset" returns to GM value
5. **Manual — existing character**: Load from localStorage → rules section shows defaults → no behavior change
6. **YAML round-trip**: Export character → re-import → `houseRules` survives intact
