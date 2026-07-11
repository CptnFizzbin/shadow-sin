import type { EdgeStoreState } from "./edgeStore.ts"

/** @deprecated Use `selectEdgeMax` from `#/stores/runner/edge/edgeSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `EdgeStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectEdgeMax = (state: EdgeStoreState) => state.max

/** @deprecated Use `selectEdgeCurrent` from `#/stores/runner/edge/edgeSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `EdgeStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectEdgeCurrent = (state: EdgeStoreState) => state.current
