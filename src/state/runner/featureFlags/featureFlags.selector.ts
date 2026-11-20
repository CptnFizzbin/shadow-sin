import type { FlagEntry, FlagValue } from "#/system/model/featureFlags/featureFlag.ts"
import type { FeatureFlagsData } from "#/system/model/featureFlags/featureFlagsData.ts"
import { resolveFlagValue } from "#/system/model/featureFlags/featureFlagsData.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

export namespace FeatureFlagSelectors {
  /** Every feature flag override the Runner has stored, keyed by flag `ref`. */
  export function selectAll(state: { runner: RunnerData }): FeatureFlagsData {
    return state.runner._data_.featureFlags
  }

  /**
   * The Runner's value for `flag`: its stored override, else the flag's `default`.
   * Components read a single flag through `useFeatureFlag`; to check a list of flags, read
   * {@link selectAll} once and resolve each with `resolveFlagValue`. Call this directly outside React.
   *
   * @example
   * const isNuyenExchangeEnabled = FeatureFlagSelectors.select(state, { flag: houseRules["karma.nuyenExchange"] })
   */
  export function select<Value extends FlagValue>(
    state: { runner: RunnerData },
    { flag }: { flag: FlagEntry<Value> },
  ): Value {
    return resolveFlagValue(selectAll(state), flag)
  }
}
