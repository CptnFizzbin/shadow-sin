import type { QualitiesStoreState } from "./qualitiesStore.ts"

/** @deprecated Use `selectQualities` from `#/stores/runner/qualities/qualitiesSlice.selectors.ts` via `useRunnerStoreSelector` instead. */
export const selectAllQualities = (state: QualitiesStoreState) => state
