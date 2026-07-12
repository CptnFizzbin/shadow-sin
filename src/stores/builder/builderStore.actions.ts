import * as builderActions from "./builderSlice.actions.ts"

/**
 * Namespaced access to `BuilderState`'s action creators (`Actions.builder.setStartingNuyen(...)`).
 * Mirrors `Actions` in `runnerStore.actions.ts`.
 */
export const Actions = {
  builder: builderActions,
}
