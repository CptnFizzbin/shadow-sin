import type { FC } from "react"

import { useArmorFormGroup } from "#/components/Character/Form/Gear/Armor/UseArmorFormGroup.ts"
import { GearItemsList } from "#/components/Character/Form/Gear/Generic/GearItemsList.tsx"

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
