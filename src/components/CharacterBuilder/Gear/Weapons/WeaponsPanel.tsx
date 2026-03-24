import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Gear/Generic/GearItemsList.tsx"
import { useWeaponsState } from "#/components/CharacterBuilder/Gear/Weapons/UseWeaponsState.ts"

export const WeaponsPanel: FC = () => {
  const { weapons, addWeapon, updateWeapon, removeWeapon } =
    useWeaponsState()

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
