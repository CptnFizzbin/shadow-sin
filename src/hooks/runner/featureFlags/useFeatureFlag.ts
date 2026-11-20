import { FeatureFlagSelectors } from "#/state/runner/featureFlags/featureFlags.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { FlagEntry, FlagValue } from "#/system/model/featureFlags/featureFlag.ts"

/**
 * The current Runner's value for `flag`, typed by the flag's `default`.
 *
 * @example
 * const isKarmaBuyEnabled = useFeatureFlag(houseRules["karma.buy.enabled"])
 */
export function useFeatureFlag<Value extends FlagValue>(flag: FlagEntry<Value>): Value {
  // An inline selector rather than `useRunnerSelector(FeatureFlagSelectors.select, { flag })`:
  // passing the generic selector by reference widens its return type to `FlagValue`.
  return useRunnerSelector((state) => FeatureFlagSelectors.select(state, { flag }))
}
