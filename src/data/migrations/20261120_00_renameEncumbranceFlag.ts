import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface MigratingOptionalRules {
  "encumbranceEnabled"?: boolean
  "items.armor.encumbrance"?: boolean
}

/**
 * Rename the Encumbrance Optional Rule override from `encumbranceEnabled` to the dotted
 * `items.armor.encumbrance` key used by `featureFlagsRegistry`, keeping its stored value.
 */
const migration: CharacterMigration<{ _data_?: { featureFlags?: { optionalRules?: MigratingOptionalRules } } }> = {
  timestamp: "2026-11-20T13:25:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      const optionalRules = draft._data_?.featureFlags?.optionalRules
      if (optionalRules === undefined || !("encumbranceEnabled" in optionalRules)) {
        return
      }

      optionalRules["items.armor.encumbrance"] ??= optionalRules.encumbranceEnabled
      delete optionalRules.encumbranceEnabled
    })
  },
}

export default migration
