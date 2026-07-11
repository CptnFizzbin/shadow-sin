import type { ProfileStoreState } from "./profileStore.ts"

export const selectProfile = (state: ProfileStoreState) => state
export const selectProfileName = (state: ProfileStoreState) => state.name
export const selectProfileAlias = (state: ProfileStoreState) => state.alias
