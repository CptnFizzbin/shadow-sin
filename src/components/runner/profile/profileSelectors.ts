import type { ProfileStoreState } from "./profileStore.ts"

/** @deprecated Use `selectProfile` from `#/stores/runner/profile/profileSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `ProfileStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectProfile = (state: ProfileStoreState) => state

/** @deprecated Use `selectProfileName` from `#/stores/runner/profile/profileSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `ProfileStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectProfileName = (state: ProfileStoreState) => state.name

/** @deprecated Use `selectProfileAlias` from `#/stores/runner/profile/profileSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `ProfileStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectProfileAlias = (state: ProfileStoreState) => state.alias
