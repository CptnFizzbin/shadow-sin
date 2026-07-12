import type { SpiritsStoreState } from "./spiritsStore.ts"

/** @deprecated Use `selectSpirits` from `#/stores/runner/spirits/spiritsSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `SpiritsStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectAllSpirits = (state: SpiritsStoreState) => state
