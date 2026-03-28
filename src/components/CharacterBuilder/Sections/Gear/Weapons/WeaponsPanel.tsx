import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Sections/Gear/Generic/GearItemsList.tsx"
import { useWeaponsState } from "#/components/CharacterBuilder/Sections/Gear/Weapons/UseWeaponsState.ts"

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
