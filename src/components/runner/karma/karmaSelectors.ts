import type { KarmaState } from "./karmaStore.ts"

/** @deprecated Use `selectCurrentKarma` from `#/stores/runner/karma/karmaSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `KarmaState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectCurrentKarma = (state: KarmaState) => state.current

/** @deprecated Use `selectTotalKarma` from `#/stores/runner/karma/karmaSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `KarmaState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectTotalKarma = (state: KarmaState) => state.total
