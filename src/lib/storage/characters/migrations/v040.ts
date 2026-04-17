import type { BaseCharacterMetadata, CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"
import type { Character_V0_3_0 } from "#/lib/storage/characters/migrations/v030.ts"
import { meleeWeaponTypes, rangedWeaponTypes } from "#/lib/system/gear/weapons/weaponTypeGroups.ts"

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

/** Input type: Character_V0_3_0 potentially carrying an untyped `gear` map. */
type CharacterV040Input = Character_V0_3_0 & {
  gear?: Record<string, GearItem_V0_4_0>
}

const migration: CharacterMigration<Character_V0_3_0, Character_V0_4_0> = {
  version: "0.4.0",
  up: (rawCharacter) => {
    const character = rawCharacter as CharacterV040Input
    const gear: Record<string, GearItem_V0_4_0> = character.gear ? { ...character.gear } : {}

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

    return { ...character, gear } as Character_V0_4_0
  },
}

export default migration
