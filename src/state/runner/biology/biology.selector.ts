import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import { metatypes, MetatypeType } from "#/system/model/biology/metatypeData.ts"
import { awakenings, AwakeningType } from "#/system/model/magic/awakeningType.ts"
import type { RunnerWithBiology } from "#/system/model/runnerTraits.ts"
import { isRunnerWithBiology } from "#/system/model/runnerTraits.ts"

type BiologyData = RunnerWithBiology["biology"]

export namespace BiologySelectors {
  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectEntity,
    (entity): BiologyData => {
      if (isRunnerWithBiology(entity)) return entity.biology

      return {
        metatype: MetatypeType.Other,
        awakening: AwakeningType.None,
        age: null,
        gender: null,
        height: null,
        weight: null,
      }
    },
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

  export const selectIsAiMetaType = createMemoizedSelector(
    selectMetatypeInfo,
    (metatype) => metatype.name === MetatypeType.AI,
  )
}
