import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import { lifestylePrepayCost, matchStandardLifestyle, startingNuyenLifestyle } from "#/system/model/finances/runnerLifestyle.ts"

export namespace LifestyleSelectors {
  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.lifestyle,
  )

  export const selectName = createMemoizedSelector(
    select,
    (lifestyle) => lifestyle.name,
  )

  /** Monthly upkeep in nuyen; negative for an income. */
  export const selectUpkeep = createMemoizedSelector(
    select,
    (lifestyle) => lifestyle.upkeep,
  )

  export const selectMonthsPaid = createMemoizedSelector(
    select,
    (lifestyle) => lifestyle.monthsPaid,
  )

  export const selectNotes = createMemoizedSelector(
    select,
    (lifestyle) => lifestyle.notes ?? "",
  )

  /** The standard lifestyle the Runner has, or `null` for a custom lifestyle. */
  export const selectStandardType = createMemoizedSelector(
    select,
    (lifestyle) => matchStandardLifestyle(lifestyle),
  )

  /** The standard lifestyle whose starting-nuyen roll applies to the Runner. */
  export const selectStartingNuyenType = createMemoizedSelector(
    select,
    (lifestyle) => startingNuyenLifestyle(lifestyle),
  )

  /** Total nuyen cost of the months already prepaid; zero for a lifestyle without upkeep. */
  export const selectPrepaidCost = createMemoizedSelector(
    select,
    (lifestyle) => lifestylePrepayCost(lifestyle, lifestyle.monthsPaid),
  )
}
