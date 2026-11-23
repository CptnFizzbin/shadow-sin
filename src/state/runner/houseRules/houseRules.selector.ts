import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"

export namespace HouseRulesSelectors {
  export const select = createMemoizedSelector(
    SelectorOptions.houseRuleKey,
    (key) => {
      switch (key) {
        case "karma.nuyenExchange":
          return true
        default:
          return false
      }
    },
  )
}
