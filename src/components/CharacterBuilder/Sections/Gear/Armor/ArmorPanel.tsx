import type { FC } from "react"

import { useArmorState } from "#/components/CharacterBuilder/Sections/Gear/Armor/UseArmorState.ts"
import { GearItemsList } from "#/components/CharacterBuilder/Sections/Gear/Generic/GearItemsList.tsx"

export const ArmorPanel: FC = () => {
  const { armor, addArmor, updateArmor, removeArmor } = useArmorState()

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
