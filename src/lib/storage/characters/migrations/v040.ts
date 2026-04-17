import { produce } from "immer"

import type { BaseCharacterMetadata, CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"
import type { Character_V0_3_0 } from "#/lib/storage/characters/migrations/v030.ts"

interface GearItem_V0_4_0 {
  id: string
  itemType: string
  weaponType?: string
  parentId?: string
  equipped?: boolean
}

export interface Character_V0_4_0 extends BaseCharacterMetadata {
  version: string
  gear: Record<string, GearItem_V0_4_0>
}

const meleeTypes = ["melee", "thrown"]
const rangedTypes = ["firearm", "projectile", "exotic", "other"]

const migration: CharacterMigration<Character_V0_3_0, Character_V0_4_0> = {
  version: "0.4.0",
  up: (character) =>
    produce(character as unknown as Character_V0_4_0, (draft) => {
      if (!draft.gear) draft.gear = {}
      const gear = draft.gear

      const weapons = Object.values(gear).filter(
        (item) => item.itemType === "weapon" && !item.parentId,
      )

      const firstMelee = weapons.find(
        (weapon) => weapon.weaponType && meleeTypes.includes(weapon.weaponType),
      )
      const firstRanged = weapons.find(
        (weapon) => weapon.weaponType && rangedTypes.includes(weapon.weaponType),
      )

      if (firstMelee && !firstMelee.equipped) {
        gear[firstMelee.id].equipped = true
      }

      if (firstRanged && !firstRanged.equipped) {
        gear[firstRanged.id].equipped = true
      }
    }),
}

export default migration
