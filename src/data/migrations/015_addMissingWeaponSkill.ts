import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import { migrationAlreadyApplied } from "#/data/characterMigration.ts"

const VERSION = 15

interface LegacyWeapon {
  itemType?: string
  weaponType?: string
  skill?: string
  firemodes?: string[]
  ammo?: unknown
  firearmType?: string
}

type LegacyCharacter = {
  gear?: Record<string, LegacyWeapon>
}

const migration: CharacterMigration<LegacyCharacter> = {
  version: VERSION,
  up: (character) => {
    if (migrationAlreadyApplied(character, VERSION)) return character as LegacyCharacter

    return produce(character, (draft) => {
      for (const item of Object.values(draft.gear ?? {})) {
        if (item.itemType !== "weapon") continue

        // Set a default skill for weapons that were saved before the skill field was required.
        if (!item.skill) {
          item.skill = item.weaponType === "melee" ? "unarmedCombat" : "automatics"
        }

        // Set empty defaults for firearm-specific fields that may be missing in old data.
        if (item.weaponType === "firearm") {
          if (!Array.isArray(item.firemodes)) {
            item.firemodes = ["SA", "BF", "FA"]
          }
          if (!item.ammo) {
            item.ammo = { size: 0, remaining: 0, type: "clip" }
          }
        }
      }
    })
  },
}

export default migration
