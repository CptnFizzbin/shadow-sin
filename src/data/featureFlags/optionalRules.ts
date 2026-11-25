import { createFlagRegistry } from "./featureFlag.ts"

/** Optional Rules: published variant rules from Shadowrun source books that a table opts into. */
export const optionalRules = createFlagRegistry("optionalRules", {
  "items.armor.encumbrance": {
    name: "Encumbrance",
    description:
      "Apply dice pool penalties to Agility and Reaction when equipped armor rating exceeds Body × 2.",
    source: { book: "SR4A", page: 161 },
    default: false,
  },
})
