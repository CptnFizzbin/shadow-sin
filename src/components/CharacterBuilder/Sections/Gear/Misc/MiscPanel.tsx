import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Sections/Gear/Generic/GearItemsList.tsx"
import { useMiscState } from "#/components/CharacterBuilder/Sections/Gear/Misc/UseMiscState.ts"

export const MiscPanel: FC = () => {
  const { misc, addMiscItem, updateMiscItem, removeMiscItem } =
    useMiscState()

  return (
    <GearItemsList
      items={misc}
      onAdd={addMiscItem}
      onUpdate={updateMiscItem}
      onRemove={removeMiscItem}
      label="Item"
    />
  )
}
