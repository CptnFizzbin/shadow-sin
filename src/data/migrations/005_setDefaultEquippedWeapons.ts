import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import { migrationAlreadyApplied } from "#/data/characterMigration.ts"
import { meleeWeaponTypes, rangedWeaponTypes } from "#/system/gear/weapons/weaponTypeGroups.ts"

const VERSION = 5

interface GearItem {
  id: string
  itemType: string
  weaponType?: string
  parentId?: string
  equipped?: boolean
}

const migration: CharacterMigration<{
  gear?: Record<string, GearItem>
}> = {
  version: VERSION,
  up: (character) => {
    if (migrationAlreadyApplied(character, VERSION)) {
      return character as { gear?: Record<string, GearItem> }
    }

    return produce(character, (draft) => {
      const gear = (draft.gear ??= {})

      const weapons = Object.values(gear).filter(
        (item) => item.itemType === "weapon" && !item.parentId,
      )

      const meleeTypeStrings = meleeWeaponTypes.map(String)
      const rangedTypeStrings = rangedWeaponTypes.map(String)

      const anyMeleeEquipped = weapons.some(
        (w) => w.weaponType && meleeTypeStrings.includes(w.weaponType) && w.equipped,
      )
      if (!anyMeleeEquipped) {
        const firstMelee = weapons.find(
          (w) => w.weaponType && meleeTypeStrings.includes(w.weaponType),
        )
        if (firstMelee) {
          gear[firstMelee.id] = { ...gear[firstMelee.id], equipped: true }
        }
      }

      const anyRangedEquipped = weapons.some(
        (w) => w.weaponType && rangedTypeStrings.includes(w.weaponType) && w.equipped,
      )
      if (!anyRangedEquipped) {
        const firstRanged = weapons.find(
          (w) => w.weaponType && rangedTypeStrings.includes(w.weaponType),
        )
        if (firstRanged) {
          gear[firstRanged.id] = { ...gear[firstRanged.id], equipped: true }
        }
      }
    })
  },
}

export default migration
