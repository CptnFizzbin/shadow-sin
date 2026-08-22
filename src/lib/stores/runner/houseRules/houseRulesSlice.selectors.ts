import { createMemoizedSelector, selectorOption } from "#/integrations/reselect/selectorUtils.ts"

export namespace HouseRulesSelectors {
  export const Options = {
    key: selectorOption<{ key: string }>("key"),
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
