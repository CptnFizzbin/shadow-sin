import type { BiologyState } from "./biologyStore.ts"

/** @deprecated Use `selectMetatype` from `#/stores/runner/biology/biologySlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `BiologyState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectMetatype = (state: BiologyState) => state.metatype

/** @deprecated Use `selectAwakening` from `#/stores/runner/biology/biologySlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `BiologyState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectAwakening = (state: BiologyState) => state.awakening
