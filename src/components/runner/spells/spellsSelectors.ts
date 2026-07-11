import type { SpellsStoreState } from "./spellsStore.ts"

/** @deprecated Use `selectSpells` from `#/stores/runner/spells/spellsSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `SpellsStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectAllSpells = (state: SpellsStoreState) => state
