import type { AnyFeatureFlag } from "./featureFlag.ts"
import { createFlag } from "./featureFlag.ts"

/**
 * Registry of all known optional rules from Shadowrun source books.
 * Each entry is a {@link FeatureFlag} descriptor that defines the rule's
 * display metadata, source reference, and SR4e stock default.
 *
 * Add new entries here to extend the optional rules system. The
 * {@link OptionalRulesData} type is automatically derived from this registry.
 */
export const optionalRulesRegistry: Record<string, AnyFeatureFlag> = {
  encumbranceEnabled: createFlag<boolean>({
    name: "Encumbrance",
    description:
      "Apply dice pool penalties to Agility and Reaction when equipped armor rating exceeds Body × 2.",
    source: { book: "SR4A", page: 161 },
    defaultValue: false,
  }),
} as const

export type OptionalRuleKey = keyof typeof optionalRulesRegistry
