import type { FC } from "react"

import { useArmorFormGroup } from "#/components/CharacterBuilder/Gear/Armor/UseArmorFormGroup.ts"
import { GearItemsList } from "#/components/CharacterBuilder/Gear/Generic/GearItemsList.tsx"

export const ArmorPanel: FC = () => {
  const { armor, addArmor, updateArmor, removeArmor } = useArmorFormGroup()

  return (
    <GearItemsList
      items={armor}
      onAdd={addArmor}
      onUpdate={updateArmor}
      onRemove={removeArmor}
      label="Armor"
    />
  )
}
