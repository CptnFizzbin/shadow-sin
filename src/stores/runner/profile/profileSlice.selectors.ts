import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import { Lifestyles } from "#/system/lifestyleType.ts"

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

  export const selectLifestyle = createMemoizedSelector(
    select,
    (profile) => profile.lifestyle,
  )

  export const selectLifestyleQuality = createMemoizedSelector(
    selectLifestyle,
    (lifestyle) => lifestyle?.quality,
  )

  export const selectLifestyleMonthsPaid = createMemoizedSelector(
    selectLifestyle,
    (lifestyle) => lifestyle?.monthsPaid,
  )

  export const selectLifestyleInfo = createMemoizedSelector(
    selectLifestyleQuality,
    (quality) => quality ? Lifestyles[quality] : undefined,
  )
}
