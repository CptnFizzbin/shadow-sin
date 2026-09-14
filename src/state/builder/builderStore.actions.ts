import { createAction } from "@reduxjs/toolkit"

/**
 * Namespaced access to `BuilderState`'s action creators (`Actions.nuyen.setStartingNuyen(...)`).
 * Mirrors `Actions` in `runnerStore.actions.ts`.
 */
export const BuilderStateActions = {
  nuyen: {
    setStartingNuyen: createAction<number | undefined>("builder/setStartingNuyen"),
  },
}
