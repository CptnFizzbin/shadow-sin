import type { NuyenState } from "./nuyenStore.ts"

/** @deprecated Use `selectNuyenAmount` from `#/stores/runner/nuyen/nuyenSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `NuyenState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectNuyenAmount = (state: NuyenState) => state.current

/** @deprecated Use `selectLoans` from `#/stores/runner/nuyen/nuyenSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `NuyenState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectLoans = (state: NuyenState) => state.loans
