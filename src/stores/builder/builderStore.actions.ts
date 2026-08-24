import * as nuyenActions from "./nuyen/nuyenSlice.actions.ts"

/**
 * Namespaced access to `BuilderState`'s action creators (`Actions.nuyen.setStartingNuyen(...)`).
 * Mirrors `Actions` in `runnerStore.actions.ts`.
 */
export const Actions = {
  nuyen: nuyenActions,
}
