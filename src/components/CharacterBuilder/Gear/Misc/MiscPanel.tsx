import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Gear/Generic/GearItemsList.tsx"
import { useMiscFormGroup } from "#/components/CharacterBuilder/Gear/Misc/UseMiscFormGroup.ts"

export const MiscPanel: FC = () => {
  const { misc, addMiscItem, updateMiscItem, removeMiscItem } =
    useMiscFormGroup()

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
