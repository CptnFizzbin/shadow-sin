import type { FC } from "react"

import { GearItemsList } from "#/components/Character/Form/Gear/Generic/GearItemsList.tsx"
import { useWeaponsFormGroup } from "#/components/Character/Form/Gear/Weapons/UseWeaponsFormGroup.ts"

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
