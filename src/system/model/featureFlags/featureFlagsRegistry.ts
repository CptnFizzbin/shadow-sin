import type { AnyFeatureFlag, FeatureFlagType, FeatureFlagValue } from "./featureFlag.ts"
import { createFlag } from "./featureFlag.ts"

/**
 * Registry of every feature flag, Optional Rules and House Rules alike. Keys are dotted and
 * feature-namespaced (`<area>.<feature>.<flag>`); each entry's `type` decides which
 * `FeatureFlagsData` namespace stores its override.
 *
 * Add new entries here to extend the feature flag system. {@link FeatureFlagKey} and the
 * per-namespace override types are derived from this registry.
 */
export const featureFlagsRegistry = {
  "items.armor.encumbrance": createFlag({
    type: "optionalRule",
    name: "Encumbrance",
    description:
      "Apply dice pool penalties to Agility and Reaction when equipped armor rating exceeds Body × 2.",
    source: { book: "SR4A", page: 161 },
    defaultValue: false,
  }),
  "items.licenseCheck.ratingPlusRating": createFlag({
    type: "houseRule",
    name: "License Check: Rating + Rating",
    description:
      "Roll rating × 2 dice for each side of a License Check's Opposed Test, instead of rating dice.",
    defaultValue: true,
  }),
  "karma.nuyenExchange": createFlag({
    type: "houseRule",
    name: "Karma–Nuyen Exchange",
    description: "Allow buying karma with nuyen and selling karma for nuyen.",
    defaultValue: true,
  }),
} as const satisfies Record<string, AnyFeatureFlag>

/** Key of any flag in {@link featureFlagsRegistry}. */
export type FeatureFlagKey = keyof typeof featureFlagsRegistry

/** Keys of the {@link featureFlagsRegistry} flags whose `type` is `Type`. */
export type FeatureFlagKeyOfType<Type extends FeatureFlagType> = {
  [Key in FeatureFlagKey]: (typeof featureFlagsRegistry)[Key]["type"] extends Type ? Key : never
}[FeatureFlagKey]

/**
 * Sparse set of overrides for the flags of `Type`. An absent field means "use the registry's
 * `defaultValue`".
 */
export type FeatureFlagOverrides<Type extends FeatureFlagType> = {
  [Key in FeatureFlagKeyOfType<Type>]?: FeatureFlagValue<(typeof featureFlagsRegistry)[Key]>
}
