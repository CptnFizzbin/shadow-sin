import { createSelector } from "#/state/reselect/selectorUtils.ts"

import type { BuilderState } from "./builderState.ts"

/**
 * Namespaced access to `BuilderState`'s selectors (`Selectors.nuyen.selectStartingNuyen`).
 * Mirrors `Selectors` in `runnerStore.selectors.ts`.
 */
export namespace BuilderStateSelectors {
  export const nuyen = {
    selectStartingNuyen: createSelector<BuilderState, number | null>((state) => {
      return state.nuyen.starting
    }),
  }
}
