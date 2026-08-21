import { createSelector } from "reselect"

import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

// TODO: Stubbed pending the persisted House Rules registry
// (docs/adr/0005-house-rules-feature-flag-namespace.md). Once `RunnerData.featureFlags.houseRules`
// exists, replace this switch with a real lookup (stored override ?? registry default), following
// the `optionalRules` namespace's pattern.
export function select(key: string) {
  return (_state: RunnerData): boolean => {
    switch (key) {
      case "items.licenseCheck.ratingPlusRating":
        return true
      default:
        return false
    }
  }
}

/** Standardized, namespaced selector for the House Rules domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy `select` export above;
 *  existing call sites are unaffected. */
export namespace HouseRulesSelectors {
  export const select: Selector<RunnerData, boolean, { key: string }> = createSelector(
    [
      (_state: RunnerData, options: { key: string }) => options.key,
    ],
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
