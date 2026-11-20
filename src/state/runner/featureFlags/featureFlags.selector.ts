import type { FlagEntry, FlagValue } from "#/system/model/featureFlags/featureFlag.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

export namespace FeatureFlagSelectors {
  /**
   * The Runner's value for `flag`: its stored override, else the flag's `default`.
   *
   * Components read flags through `useFeatureFlag`; call this directly outside React.
   *
   * @example
   * const isNuyenExchangeEnabled = FeatureFlagSelectors.select(state, { flag: houseRules["karma.nuyenExchange"] })
   */
  export function select<Value extends FlagValue>(
    state: { runner: RunnerData },
    { flag }: { flag: FlagEntry<Value> },
  ): Value {
    const stored = state.runner._data_.featureFlags[flag.ref]
    // A stored value of the wrong type (e.g. a string for a boolean flag) can't be trusted,
    // so it falls back to the default rather than leaking an off-type value to callers.
    return typeof stored === typeof flag.default ? stored as Value : flag.default
  }
}
