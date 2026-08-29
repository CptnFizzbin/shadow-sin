import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import { awakenings } from "#/system/awakeningType.ts"
import { metatypes } from "#/system/metatypeData.ts"

export namespace BiologySelectors {
  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.biology,
  )

  export const selectMetatype = createMemoizedSelector(
    select,
    (biology) => biology.metatype,
  )

  export const selectAwakening = createMemoizedSelector(
    select,
    (biology) => biology.awakening,
  )

  export const selectMetatypeInfo = createMemoizedSelector(
    selectMetatype,
    (metatype) => metatypes[metatype],
  )

  export const selectAwakeningInfo = createMemoizedSelector(
    selectAwakening,
    (awakening) => awakenings[awakening],
  )
}
