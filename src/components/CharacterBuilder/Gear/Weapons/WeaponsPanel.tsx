import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Gear/Generic/GearItemsList.tsx"
import { useWeaponsFormGroup } from "#/components/CharacterBuilder/Gear/Weapons/UseWeaponsFormGroup.ts"

export const WeaponsPanel: FC = () => {
  const { weapons, addWeapon, updateWeapon, removeWeapon } =
    useWeaponsFormGroup()

  return (
    <GearItemsList
      items={weapons}
      onAdd={addWeapon}
      onUpdate={updateWeapon}
      onRemove={removeWeapon}
      label="Weapon"
    />
  )
}
