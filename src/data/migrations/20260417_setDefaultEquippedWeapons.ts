import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import { meleeWeaponTypes, rangedWeaponTypes } from "#/system/gear/weapons/weaponTypeGroups.ts"

interface GearItem {
  id: string
  itemType: string
  weaponType?: string
  parentId?: string
  _state?: {
    equipped?: boolean
    stashed?: boolean
  }
}

const migration: CharacterMigration<{
  gear?: Record<string, GearItem>
}> = {
  id: "20260417",
  up: produce((character) => {
    const gear = (character.gear ??= {})

    const weapons = Object.values(gear).filter(
      (item) => item.itemType === "weapon" && !item.parentId,
    )

    const meleeTypeStrings = meleeWeaponTypes.map(String)
    const rangedTypeStrings = rangedWeaponTypes.map(String)

    const anyMeleeEquipped = weapons.some(
      (w) => w.weaponType && meleeTypeStrings.includes(w.weaponType) && w._state?.equipped,
    )
    if (!anyMeleeEquipped) {
      const firstMelee = weapons.find(
        (w) => w.weaponType && meleeTypeStrings.includes(w.weaponType),
      )
      if (firstMelee) {
        gear[firstMelee.id] = {
          ...gear[firstMelee.id],
          _state: { ...gear[firstMelee.id]._state, equipped: true },
        }
      }
    }

    const anyRangedEquipped = weapons.some(
      (w) => w.weaponType && rangedTypeStrings.includes(w.weaponType) && w._state?.equipped,
    )
    if (!anyRangedEquipped) {
      const firstRanged = weapons.find(
        (w) => w.weaponType && rangedTypeStrings.includes(w.weaponType),
      )
      if (firstRanged) {
        gear[firstRanged.id] = {
          ...gear[firstRanged.id],
          _state: { ...gear[firstRanged.id]._state, equipped: true },
        }
      }
    }
  }),
}

export default migration
