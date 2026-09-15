import type { BuilderState } from "#/components/builder/builderState.ts"
import { createSelector } from "#/integrations/reselect/selectorUtils.ts"

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
