# Plan: Spend Karma Dialog Refactor

## Status

Draft — ready for implementation

---

## 1. Current State Analysis

### File inventory

| Path (relative to `src/components/character/karma/`)      | Role                                                                                                 | Status                    |
|-----------------------------------------------------------|------------------------------------------------------------------------------------------------------|---------------------------|
| `spendKarmaDialog.tsx`                                    | Thin wrapper: mounts `SpendKarmaDialogProvider` + `SpendKarmaDialogContent`                          | Active                    |
| `spendKarmaDialogContent.tsx`                             | Renders tab bar, karma display, Save/Cancel buttons; reads from context                              | Active                    |
| `characterImprovements/forms/spendKarmaDialogContext.tsx` | **288-line monolith** — ALL state for all tabs + karma cost + `handleSave`                           | Active, needs refactor    |
| `characterImprovements/attributeTab.tsx`                  | Attribute improvement UI; reads `availableAttributes`, `selectedAttribute`, etc. from context        | Active, needs refactor    |
| `characterImprovements/increaseSkillTab.tsx`              | Increase-skill UI; reads `availableIncreaseSkills`, `selectedIncreaseSkillKey`, etc. from context    | Active, needs refactor    |
| `characterImprovements/newSkillTab.tsx`                   | New-skill UI; reads `availableNewSkills`, `selectedNewSkillKey`, etc. from context                   | Active, needs refactor    |
| `characterImprovements/newSpellTab.tsx`                   | Static description only — no context reads                                                           | Active, no changes needed |
| `characterImprovements/skillGroupTab.tsx`                 | Skill-group UI; reads `availableSkillGroups`, `selectedSkillGroupKey`, etc. from context             | Active, needs refactor    |
| `characterImprovements/improvementsStore.ts`              | `ImprovementsStore` class                                                                            | Active, no changes needed |
| `characterImprovements/improvementsUtils.ts`              | `applyImprovements(store, characterStore)`                                                           | Active, needs new export  |
| `characterImprovements/forms/improveAttributeForm.ts`     | Empty file                                                                                           | Delete                    |
| `spendKarmaDialogContext.tsx`                             | **Duplicate** of `characterImprovements/forms/spendKarmaDialogContext.tsx` (289 lines, same content) | Dead — delete             |
| `spendKarmaAttributeTab.tsx`                              | **Duplicate** of `characterImprovements/attributeTab.tsx`                                            | Dead — delete             |
| `spendKarmaIncreaseSkillTab.tsx`                          | **Duplicate** of `characterImprovements/increaseSkillTab.tsx`                                        | Dead — delete             |
| `spendKarmaNewSkillTab.tsx`                               | **Duplicate** of `characterImprovements/newSkillTab.tsx`                                             | Dead — delete             |
| `spendKarmaNewSpellTab.tsx`                               | **Duplicate** of `characterImprovements/newSpellTab.tsx`                                             | Dead — delete             |
| `spendKarmaSkillGroupTab.tsx`                             | **Duplicate** of `characterImprovements/skillGroupTab.tsx`                                           | Dead — delete             |

### Problems

#### Problem 1 — `forms/spendKarmaDialogContext.tsx` is a 288-line monolith

The context currently owns:

- **All 4 tabs' local UI state**: `selectedAttribute`, `selectedSkillGroupKey`, `selectedIncreaseSkillKey`,
  `selectedNewSkillKey`
- **All 4 tabs' option lists** computed via `useMemo`
- **All 4 tabs' karma cost formulas** (one `useMemo` switch block)
- **`handleSave`** — assembles an `ImprovementsStore` inline, calls `applyImprovements()`, and calls
  `karmaStore.spendKarma()` directly
- **`handleClosed` / `handleSpendTypeChange`** — resets ALL tab states in one place
- `canLearnSpell` logic

Consequence: adding or changing any tab touches this single file; responsibility is completely blurred.

#### Problem 2 — Duplicate legacy tab files

The five `spendKarma*Tab.tsx` files in `karma/` (outside `characterImprovements/`) appear to be an older generation.
They are no longer imported anywhere — `spendKarmaDialogContent.tsx` imports only from `characterImprovements/`. They
are dead code that create confusion.

#### Problem 3 — `applyImprovements` and `karmaStore.spendKarma` are split

`improvementsUtils.ts` owns `applyImprovements` but `karmaStore.spendKarma` is called ad-hoc in the context. Any future
caller must remember to call both and in the right order. A single `applyImprovementsAndSpendKarma` function should be
the canonical entrypoint.

---

## 2. Target Architecture

### `forms/spendKarmaDialogContext.tsx` (slimmed to ~80 lines)

Provides only:

```ts
interface SpendKarmaDialogContextValue {
  // Read-only data
  currentKarma: number
  canLearnSpell: boolean

  // Tab routing
  spendType: SpendType
  handleSpendTypeChange: (event: SyntheticEvent, newValue: SpendType) => void

  // Save surface (driven by active tab)
  karmaCost: number | null
  canSave: boolean
  setPendingImprovement: (improvement: PendingImprovement | null) => void

  // Flow control
  handleSave: () => void
  handleClosed: () => void
}
```

`PendingImprovement` is a value type:

```ts
interface PendingImprovement {
  improvementsStore: ImprovementsStore
  karmaCost: number
}
```

> A single `setPendingImprovement` object is atomic and simpler than two separate setters.

`handleSave` becomes:

```ts
const handleSave = () => {
  if (!canSave) return

  if (spendType === "newSpell") {
    applyImprovementsAndSpendKarma(new ImprovementsStore({ improvements: [] }), characterStore, karmaStore, NEW_SPELL_KARMA_COST)
    ctrl.close()
    onNewSpell?.()
    return
  }

  if (!pendingImprovement) return
  applyImprovementsAndSpendKarma(
    pendingImprovement.improvementsStore,
    characterStore,
    karmaStore,
    pendingImprovement.karmaCost,
  )
  ctrl.close()
}
```

### Each tab becomes self-contained

Example — `attributeTab.tsx` after refactor:

- Reads `attributes` and `attrInfos` directly via `useCharacterSheetSelector` / `useAllAttrInfos`
- Owns `selectedAttribute` state locally
- Computes `karmaCost` and `availableAttributes` locally
- On selection change: builds a new `ImprovementsStore`, calls
  `context.setPendingImprovement({ improvementsStore, karmaCost })`
- On `""` selection or unmount: calls `context.setPendingImprovement(null)`
- Detects tab switch via `spendType` from context and resets its own state via `useEffect`

### `improvementsUtils.ts` — new export

```ts
export const applyImprovementsAndSpendKarma = (
  improvementsStore: ImprovementsStore,
  characterStore: CharacterSheetStore,
  karmaStore: KarmaStore,
  karmaCost: number,
): void => {
  applyImprovements(improvementsStore, characterStore)
  karmaStore.spendKarma(karmaCost)
}
```

---

## 3. Step-by-Step Refactoring Plan

Work can be committed at the end of each stage; each stage leaves the UI fully functional.

### Stage 1 — Delete dead duplicate files *(low risk, safe first)*

**Files to delete:**

- `karma/spendKarmaDialogContext.tsx`
- `karma/spendKarmaAttributeTab.tsx`
- `karma/spendKarmaIncreaseSkillTab.tsx`
- `karma/spendKarmaNewSkillTab.tsx`
- `karma/spendKarmaNewSpellTab.tsx`
- `karma/spendKarmaSkillGroupTab.tsx`
- `karma/characterImprovements/forms/improveAttributeForm.ts` *(empty)*

**Verification:** `yarn fallow dead-code` should report these as gone; `yarn fix` should pass.

---

### Stage 2 — Add `applyImprovementsAndSpendKarma` to `improvementsUtils.ts`

**Modify:** `characterImprovements/improvementsUtils.ts`

Add the new named export `applyImprovementsAndSpendKarma(improvementsStore, characterStore, karmaStore, karmaCost)` that
calls `applyImprovements` then `karmaStore.spendKarma`.

No callers are changed yet — the context still calls them separately. This is purely additive.

**Verification:** `yarn fix` passes; no existing behavior changes.

---

### Stage 3 — Add `PendingImprovement` type and `setPendingImprovement` to the context

**Modify:** `characterImprovements/forms/spendKarmaDialogContext.tsx`

1. Define and export `PendingImprovement` interface (`improvementsStore: ImprovementsStore`, `karmaCost: number`).
2. Add `pendingImprovement` state: `useState<PendingImprovement | null>(null)`.
3. Expose `setPendingImprovement` and a derived `karmaCost` (`pendingImprovement?.karmaCost ?? null`) in `contextValue`.
4. Keep all existing per-tab state and `handleSave` logic untouched for now — both paths coexist.
5. Update `handleSave` to prefer `pendingImprovement` when set (i.e., if `pendingImprovement != null`, use
   `applyImprovementsAndSpendKarma`; otherwise fall through to existing switch).
6. Update `handleSpendTypeChange` and `handleClosed` to also call `setPendingImprovement(null)`.

**Verification:** Existing behavior unchanged; new context shape is backward-compatible.

---

### Stage 4 — Refactor tabs one at a time

For each tab, make it self-contained and wire it to `setPendingImprovement`. Do them in this order (simplest first):

#### 4a — `newSpellTab.tsx`

No local state needed. The context handles `spendType === "newSpell"` specially in `handleSave` using the hardcoded
`NEW_SPELL_KARMA_COST`. The context already derives `karmaCost` as `NEW_SPELL_KARMA_COST` when
`spendType === "newSpell"`. No `setPendingImprovement` call required. This tab file stays as-is.

#### 4b — `attributeTab.tsx`

1. Remove reads of `availableAttributes`, `selectedAttribute`, `setSelectedAttribute`, `attributes`, `attrInfos` from
   context.
2. Add local `useState<AttributeKey | "">("")` for `selectedAttribute`.
3. Use `useCharacterSheetSelector` for `attributes` and `useAllAttrInfos()` for `attrInfos` directly.
4. Compute `availableAttributes` locally (no manual `useMemo` — compiler handles it).
5. On selection change: build a fresh `ImprovementsStore`, call `improveAttribute(...)`, call
   `context.setPendingImprovement({ improvementsStore, karmaCost })`.
6. On `""` selection: call `context.setPendingImprovement(null)`.
7. Add a `useEffect` watching `spendType` from context — when `spendType !== "attribute"` reset local state and call
   `context.setPendingImprovement(null)`.

#### 4c — `skillGroupTab.tsx`

Analogous to 4b: local `selectedSkillGroupKey` state, reads `skillGroups` from sheet directly, computes
`availableSkillGroups` inline, calls `context.setPendingImprovement`.

#### 4d — `increaseSkillTab.tsx`

Analogous: local `selectedIncreaseSkillKey` state, reads `activeSkills` + `skillGroups` from sheet, computes
`availableIncreaseSkills` and `selectedIncreaseSkillEntry` inline.

#### 4e — `newSkillTab.tsx`

Analogous: local `selectedNewSkillKey` state, reads `activeSkills` + `skillGroups` from sheet, computes
`availableNewSkills` inline.

After each sub-step: confirm dialog still works end-to-end before moving to the next tab.

---

### Stage 5 — Strip context down to lean shape

After all tabs are self-sufficient, remove from `forms/spendKarmaDialogContext.tsx`:

- All per-tab `useState` hooks (`selectedAttribute`, `selectedSkillGroupKey`, `selectedIncreaseSkillKey`,
  `selectedNewSkillKey`)
- All `useMemo` option-list computations
- `availableAttributes`, `availableSkillGroups`, `availableIncreaseSkills`, `availableNewSkills`,
  `selectedIncreaseSkillEntry` context values
- `attributes`, `attrInfos` context values
- Per-tab `setSelected*` context values
- The karma cost `useMemo` switch block (now derived solely from `pendingImprovement?.karmaCost` + `newSpell` fallback)
- The old `handleSave` switch logic (replaced by `applyImprovementsAndSpendKarma`)
- `activeSkills`, `skillGroups` reads (tabs own these now)

**Update `SpendKarmaDialogContextValue` interface** to match the lean shape.

**Verification:** `yarn fix` + `yarn fallow dead-code` pass; dialog is fully functional.

---

### Stage 6 — Cleanup

1. Evaluate whether `IncreaseSkillEntry` type should move into `characterImprovements/types/` (e.g.,
   `increaseSkillEntry.ts`) instead of living in the context file or being inlined.
2. Confirm karma cost constants (`NEW_SPELL_KARMA_COST`, `NEW_SKILL_KARMA_COST`, `attributeKarmaCost`, etc.) are
   co-located with the tab that uses them, or extracted to a shared `karmaCosts.ts` if reused across multiple files.
3. Run `yarn fix` and `yarn fallow dead-code` one final time.

---

## 4. Files Changed / Created / Deleted

| File                                                      | Action                                                                                                          |
|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `karma/spendKarmaDialogContext.tsx`                       | **Delete** (dead duplicate)                                                                                     |
| `karma/spendKarmaAttributeTab.tsx`                        | **Delete** (dead duplicate)                                                                                     |
| `karma/spendKarmaIncreaseSkillTab.tsx`                    | **Delete** (dead duplicate)                                                                                     |
| `karma/spendKarmaNewSkillTab.tsx`                         | **Delete** (dead duplicate)                                                                                     |
| `karma/spendKarmaNewSpellTab.tsx`                         | **Delete** (dead duplicate)                                                                                     |
| `karma/spendKarmaSkillGroupTab.tsx`                       | **Delete** (dead duplicate)                                                                                     |
| `characterImprovements/forms/improveAttributeForm.ts`     | **Delete** (empty)                                                                                              |
| `characterImprovements/improvementsUtils.ts`              | **Modify** — add `applyImprovementsAndSpendKarma` export                                                        |
| `characterImprovements/forms/spendKarmaDialogContext.tsx` | **Modify** — slim to ~90 lines; add `PendingImprovement` type and `setPendingImprovement`; remove per-tab state |
| `characterImprovements/attributeTab.tsx`                  | **Modify** — own local state; call `setPendingImprovement`                                                      |
| `characterImprovements/skillGroupTab.tsx`                 | **Modify** — own local state; call `setPendingImprovement`                                                      |
| `characterImprovements/increaseSkillTab.tsx`              | **Modify** — own local state; call `setPendingImprovement`                                                      |
| `characterImprovements/newSkillTab.tsx`                   | **Modify** — own local state; call `setPendingImprovement`                                                      |
| `characterImprovements/newSpellTab.tsx`                   | **No change**                                                                                                   |
| `spendKarmaDialog.tsx`                                    | **No change**                                                                                                   |
| `spendKarmaDialogContent.tsx`                             | **No change** (already thin)                                                                                    |
| `characterImprovements/types/increaseSkillEntry.ts`       | **Optionally create** — if `IncreaseSkillEntry` is moved out of context                                         |
| `characterImprovements/karmaCosts.ts`                     | **Optionally create** — if cost constants should be shared                                                      |

---

## 5. Edge Cases & Risks

### Risk 1 — `IncreaseSkillEntry` is exported from the context

`increaseSkillTab.tsx` currently imports `IncreaseSkillEntry` from the context. After Stage 5 the context no longer owns
it. Either:

- (a) Move `IncreaseSkillEntry` to `characterImprovements/types/increaseSkillEntry.ts` and update imports, or
- (b) Define it inline in `increaseSkillTab.tsx` itself since nothing else uses it.

### Risk 2 — Tab reset on switch

Currently `handleSpendTypeChange` resets all tab states in one place. After the refactor, each tab must reset its own
state when the active tab changes. Recommended approach: each tab reads `spendType` from context via
`useSpendKarmaDialogContext()` and uses a `useEffect` with `[spendType]` dependency to reset its local state + call
`setPendingImprovement(null)` when `spendType` no longer matches its own type.

Be careful: with `babel-plugin-react-compiler` active, effects with non-primitive deps may be tracked differently. Keep
deps simple (just the `spendType` string).

### Risk 3 — `canLearnSpell` still needs `onNewSpell` and `awakeningType`

The context must keep `awakeningType` read and `canLearnSpell` derivation. The `newSpellTab.tsx` path in `handleSave`
still calls `onNewSpell?.()` — this stays in the context's `handleSave`. Do not accidentally remove this.

### Risk 4 — `newSpell` has a fixed karma cost unrelated to `pendingImprovement`

The `newSpell` path never calls `setPendingImprovement` (no skill/attribute change to apply). The context should compute
`karmaCost` for the `newSpell` case as a constant fallback:

```ts
karmaCost = (spendType === "newSpell") ? NEW_SPELL_KARMA_COST : pendingImprovement?.karmaCost ?? null
```

This keeps `canSave` working for the spell tab without the tab needing to call `setPendingImprovement`.

### Risk 5 — TanStack React Compiler compatibility

Avoid introducing `useCallback`/`useMemo` unless strictly needed. The compiler infers memoization. Explicit hooks may
interfere. Let derived values in tabs compute inline.

### Risk 6 — Context type contract bump

`SpendKarmaDialogContextValue` loses many fields across stages. If any other file outside this folder imports the
context type directly (not just `useSpendKarmaDialogContext`), it may break. Run a search for
`SpendKarmaDialogContextValue` before Stage 5.

---

## 6. Definition of Done

- [ ] All six legacy `spendKarma*` files in `karma/` are deleted
- [ ] `improveAttributeForm.ts` is deleted
- [ ] `improvementsUtils.ts` exports `applyImprovementsAndSpendKarma`
- [ ] `forms/spendKarmaDialogContext.tsx` is ≤ ~90 lines and owns no per-tab selection state
- [ ] Each of the four stateful tabs (`attributeTab`, `skillGroupTab`, `increaseSkillTab`, `newSkillTab`) owns its own
  local state and calls `context.setPendingImprovement` to surface pending changes
- [ ] `handleSave` in the context calls `applyImprovementsAndSpendKarma` (not `applyImprovements` + `spendKarma`
  separately)
- [ ] `yarn fix` passes (lint/format clean)
- [ ] `yarn fallow dead-code` reports no unused exports in the affected files
- [ ] Manual smoke test: open Spend Karma dialog → switch between each tab → make a selection → Save → character sheet
  updates and karma decreases correctly
