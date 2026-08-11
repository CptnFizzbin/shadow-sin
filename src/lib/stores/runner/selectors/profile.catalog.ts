import {
  selectProfile,
  selectProfileDisplayName,
  selectPublicAwareness,
} from "#/lib/stores/runner/profile/profileSlice.selectors.ts"

export const profileCatalog = {
  all: selectProfile,
  displayName: selectProfileDisplayName,
  publicAwareness: selectPublicAwareness,
}
