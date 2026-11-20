import type { FlagValue } from "./featureFlag.ts"

/**
 * A Runner's feature flag overrides, keyed by each flag's namespaced `ref`
 * (e.g. `houseRules.karma.nuyenExchange`). An absent key means the flag uses its registry `default`.
 */
export type FeatureFlagsData = Record<string, FlagValue>
