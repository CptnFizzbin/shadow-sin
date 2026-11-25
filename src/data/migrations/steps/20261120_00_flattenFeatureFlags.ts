import { produce } from "immer"

import type { CharacterMigration } from "#data/migrations/characterMigration.ts"

type MigratingFlagValue = string | boolean
type MigratingFeatureFlags = Record<string, MigratingFlagValue | Record<string, unknown>>

const NESTED_NAMESPACES = ["optionalRules", "houseRules"] as const

// Flags whose key changed alongside the flattening: Encumbrance predates feature-namespaced keys, and the
// karma-nuyen exchange toggle became one toggle per trade direction (selling was never stored per Runner).
const RENAMED_KEYS: Record<string, string> = {
  "optionalRules.encumbranceEnabled": "optionalRules.items.armor.encumbrance",
  "houseRules.karma.nuyenExchange": "houseRules.karma.buy.enabled",
}

const isFlagValue = (value: unknown): value is MigratingFlagValue =>
  typeof value === "string" || typeof value === "boolean"

/**
 * Flatten the nested `featureFlags.optionalRules` / `featureFlags.houseRules` override objects into
 * one record keyed by each flag's `<namespace>.<key>` ref, renaming `encumbranceEnabled` to
 * `items.armor.encumbrance` and `karma.nuyenExchange` to `karma.buy.enabled` on the way.
 */
const migration: CharacterMigration<{ _data_?: { featureFlags?: MigratingFeatureFlags } }> = {
  timestamp: "2026-11-20T13:25:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      const featureFlags = draft._data_?.featureFlags
      if (featureFlags === undefined) {
        return
      }

      for (const namespace of NESTED_NAMESPACES) {
        const nested = featureFlags[namespace]
        if (typeof nested !== "object") {
          continue
        }

        for (const [key, value] of Object.entries(nested)) {
          const ref = `${namespace}.${key}`
          if (isFlagValue(value)) {
            featureFlags[RENAMED_KEYS[ref] ?? ref] ??= value
          }
        }
        delete featureFlags[namespace]
      }
    })
  },
}

export default migration
