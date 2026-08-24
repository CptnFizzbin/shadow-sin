import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { SelectorOptions } from "#/lib/stores/runner/selectorOptions.ts"

export namespace HouseRulesSelectors {
  export const Options = {
    key: SelectorOptions.houseRuleKey,
  }

  export const select = createMemoizedSelector(
    Options.key,
    (key) => {
      switch (key) {
        case "items.licenseCheck.ratingPlusRating":
          return true
        default:
          return false
      }
    },
  )
}
