import type { ComplexFormsStoreState } from "./complexFormsStore.ts"

/** @deprecated Use `selectComplexForms` from `#/stores/runner/complexForms/complexFormsSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `ComplexFormsStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectAllComplexForms = (state: ComplexFormsStoreState) => state
