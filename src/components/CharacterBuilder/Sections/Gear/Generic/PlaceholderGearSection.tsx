import Stack from "@mui/material/Stack"
import type { FC } from "react"

import type { GearItemFormState } from "#/components/CharacterBuilder/Sections/Gear/Generic/Forms/GearItemFormState.ts"
import { GearItemsList } from "#/components/CharacterBuilder/Sections/Gear/Generic/GearItemsList.tsx"
import { useGearApi, useGearByType } from "#/components/Gear/UseGearApi.ts"

type GearItemSectionField =
  | "gear.weapons"
  | "gear.armor"
  | "gear.vehicles"
  | "gear.misc"

interface PlaceholderGearSectionProps {
  field: GearItemSectionField
  label: string
}

export const PlaceholderGearSection: FC<PlaceholderGearSectionProps> = ({
  field,
  label,
}) => {
  const sectionKey = field.split(".")[1] as
    | "weapons"
    | "armor"
    | "vehicles"
    | "misc"

  const gear = useGearApi()
  const items = useGearByType<GearItemFormState>(sectionKey)

  const addItem = (item: Omit<GearItemFormState, "id">) => {
    gear.add({ ...item, itemType: sectionKey })
  }

  const updateItem = (item: GearItemFormState) => {
    gear.set({ ...item, itemType: sectionKey })
  }

  const removeItem = (item: GearItemFormState) => {
    gear.remove(item.id, { removeChildren: true })
  }

  return (
    <Stack gap={1}>
      <GearItemsList
        items={items}
        onAdd={addItem}
        onUpdate={updateItem}
        onRemove={removeItem}
        label={label}
      />
    </Stack>
  )
}
