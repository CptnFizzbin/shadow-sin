import type { TraditionStoreState } from "./traditionStore.ts"

/** @deprecated Use `selectTradition` from `#/stores/runner/tradition/traditionSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `TraditionStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectTradition = (state: TraditionStoreState) => state
