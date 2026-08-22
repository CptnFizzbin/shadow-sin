import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector, selectorOption } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

// TODO: Stubbed pending the persisted House Rules registry
// (docs/adr/0005-house-rules-feature-flag-namespace.md). Once `RunnerData.featureFlags.houseRules`
// exists, replace this switch with a real lookup (stored override ?? registry default), following
// the `optionalRules` namespace's pattern.
/** Standardized, namespaced selector for the House Rules domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace HouseRulesSelectors {
  export type HouseRulesSelector<TReturn, TOptions extends object | never = never> = Selector<
    { runner: RunnerData }, TReturn, TOptions
  >

  export const Options = {
    key: selectorOption<{ key: string }>("key"),
  }

  export const select = createMemoizedSelector(
    [
      Options.key,
    ],
    (key) => {
      switch (key) {
        case "items.licenseCheck.ratingPlusRating":
          return true
        default:
          return false
      }
    },
  ) satisfies HouseRulesSelector<boolean, { key: string }>
}
