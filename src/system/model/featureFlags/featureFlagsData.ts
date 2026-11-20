import type { FlagEntry, FlagValue } from "./featureFlag.ts"

/**
 * A Runner's feature flag overrides, keyed by each flag's namespaced `ref`
 * (e.g. `houseRules.karma.nuyenExchange`). An absent key means the flag uses its registry `default`.
 */
export type FeatureFlagsData = Record<string, FlagValue>

/**
 * `flag`'s value in `featureFlags`: the stored override at its `ref`, else its `default`.
 * A stored value whose type differs from the `default` is ignored in favour of the `default`.
 */
export function resolveFlagValue<Value extends FlagValue>(
  featureFlags: FeatureFlagsData,
  flag: FlagEntry<Value>,
): Value {
  const stored = featureFlags[flag.ref]
  return typeof stored === typeof flag.default ? stored as Value : flag.default
}
