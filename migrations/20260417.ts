import { produce } from "immer"

import type { CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"
import { meleeWeaponTypes, rangedWeaponTypes } from "#/lib/system/gear/weapons/weaponTypeGroups.ts"

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
  id: "20260417",
  checkApplied: (character) => {
    const chars = character as { gear?: Record<string, GearItem> }
    const gear = chars.gear ?? {}
    const weapons = Object.values(gear).filter(
      (item) => item.itemType === "weapon" && !item.parentId,
    )

    const meleeTypeStrings = meleeWeaponTypes.map(String)
    const rangedTypeStrings = rangedWeaponTypes.map(String)

    const meleeWeapons = weapons.filter((w) => w.weaponType && meleeTypeStrings.includes(w.weaponType))
    const rangedWeapons = weapons.filter((w) => w.weaponType && rangedTypeStrings.includes(w.weaponType))

    const hasEquippedMelee = meleeWeapons.length === 0 || meleeWeapons.some((w) => w.equipped)
    const hasEquippedRanged = rangedWeapons.length === 0 || rangedWeapons.some((w) => w.equipped)

    return hasEquippedMelee && hasEquippedRanged
  },
  up: (prev) =>
    produce(prev, (draft) => {
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
    }),
}

export default migration
