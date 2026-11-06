import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"

export namespace ProfileSelectors {
  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.profile,
  )

  export const selectName = createMemoizedSelector(
    select,
    (profile) => profile.name,
  )

  export const selectAlias = createMemoizedSelector(
    select,
    (profile) => profile.alias,
  )

  /** The Runner's alias, falling back to their legal name when no alias is set. */
  export const selectDisplayName = createMemoizedSelector(
    selectAlias,
    selectName,
    (alias, name) => alias || name,
  )
}
