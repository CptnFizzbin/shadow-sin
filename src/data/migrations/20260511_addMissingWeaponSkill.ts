import { produce } from "immer"

<<<<<<<< HEAD:src/data/migrations/20260511_addMissingWeaponSkill.ts
import type { CharacterMigration } from "#/data/characterMigration.ts"
========
import type { CharacterMigration } from "#/runner/characterMigration.ts"
>>>>>>>> shadowrun-4e:src/runner/migrations/20260511_addMissingWeaponSkill.ts

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
  id: "20260511",
  up: produce((draft) => {
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
  }),
}

export default migration
