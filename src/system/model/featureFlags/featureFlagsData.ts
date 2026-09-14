import type { OptionalRulesData } from "./optionalRulesData.ts"

/**
 * Container for all feature flag namespaces on a Runner or in a GameConfig.
 * Every namespace is optional — an absent namespace means all flags in that
 * namespace use their SR4e stock defaults from the corresponding registry.
 */
export interface FeatureFlagsData {
  /**
   * Optional rules from Shadowrun source books. An absent field within
   * `optionalRules` falls back to the SR4e default defined in
   * `optionalRulesRegistry`.
   */
  optionalRules?: OptionalRulesData
}
