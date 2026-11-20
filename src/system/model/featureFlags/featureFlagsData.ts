import type { FeatureFlagType } from "./featureFlag.ts"
import type { FeatureFlagOverrides } from "./featureFlagsRegistry.ts"

/** Sparse set of Optional Rule overrides for a Runner or GameConfig. */
export type OptionalRulesData = FeatureFlagOverrides<"optionalRule">

/** Sparse set of House Rule overrides for a Runner or GameConfig. */
export type HouseRulesData = FeatureFlagOverrides<"houseRule">

/**
 * Container for all feature flag namespaces on a Runner or in a GameConfig.
 * Every namespace is optional — an absent namespace, or an absent field within one, means the
 * flag uses its `defaultValue` from `featureFlagsRegistry`.
 */
export interface FeatureFlagsData {
  /** Overrides for Optional Rules — published variant rules from Shadowrun source books. */
  optionalRules?: OptionalRulesData
  /** Overrides for House Rules — app-invented design choices with no source book behind them. */
  houseRules?: HouseRulesData
}

/** The {@link FeatureFlagsData} namespace that stores the overrides for each {@link FeatureFlagType}. */
export const featureFlagNamespaces = {
  optionalRule: "optionalRules",
  houseRule: "houseRules",
} as const satisfies Record<FeatureFlagType, keyof FeatureFlagsData>
