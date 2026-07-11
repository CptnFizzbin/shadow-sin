import type { InitiativePassState } from "./initiativePassStore.ts"

/** @deprecated Use `selectPassesCompleted` from `#/stores/runner/initiative/initiativeSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `InitiativePassState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectPassesCompleted = (state: InitiativePassState) => state.passesCompleted

/** @deprecated Use `selectRolledResults` from `#/stores/runner/initiative/initiativeSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `InitiativePassState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectRolledResults = (state: InitiativePassState) => state.rolledResults

/** @deprecated Use `selectGoingFirst` from `#/stores/runner/initiative/initiativeSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `InitiativePassState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectGoingFirst = (state: InitiativePassState) => state.goingFirst === true

/** @deprecated Use `selectExtraPasses` from `#/stores/runner/initiative/initiativeSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `InitiativePassState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectExtraPasses = (state: InitiativePassState) => state.extraPasses
