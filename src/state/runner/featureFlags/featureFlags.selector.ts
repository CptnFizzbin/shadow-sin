import type { FlagEntry, FlagValue } from "#data/featureFlags/featureFlag.ts"
import type { FeatureFlagsData } from "#data/featureFlags/featureFlagsData.ts"
import { resolveFlagValue } from "#data/featureFlags/featureFlagsData.ts"
import type { RunnerData } from "#data/runner/runnerData.ts"

export namespace FeatureFlagSelectors {
  /** Every feature flag override the Runner has stored, keyed by flag `ref`. */
  export function selectAll(state: { runner: RunnerData }): FeatureFlagsData {
    return state.runner._data_.featureFlags
  }

  /**
   * The Runner's value for `flag`: its stored override, else the flag's `default`.
   * Components read a single flag through `useFeatureFlag`. A domain selector that combines several
   * flags builds on {@link selectAll} and resolves each with `resolveFlagValue`.
   *
   * @example
   * const isKarmaBuyEnabled = FeatureFlagSelectors.select(state, { flag: houseRules["karma.buy.enabled"] })
   */
  export function select<Value extends FlagValue>(
    state: { runner: RunnerData },
    { flag }: { flag: FlagEntry<Value> },
  ): Value {
    return resolveFlagValue(selectAll(state), flag)
  }
}
