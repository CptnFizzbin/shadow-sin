import type { AdeptPowersStoreState } from "./adeptPowersStore.ts"

/** @deprecated Use `selectPowers` from `#/stores/runner/powers/powersSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `AdeptPowersStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectAllAdeptPowers = (state: AdeptPowersStoreState) => state
