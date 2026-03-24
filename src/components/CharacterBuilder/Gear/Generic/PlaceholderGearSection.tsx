import Stack from "@mui/material/Stack"
import type { FC } from "react"

import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { GearItemsList } from "#/components/CharacterBuilder/Gear/Generic/GearItemsList.tsx"
import { useBuilderGearApi } from "#/components/CharacterBuilder/Gear/UseBuilderGearApi.ts"

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

  const gear = useBuilderGearApi()
  const items = gear.getItemsByType<GearItemFormState>(sectionKey)

  const addItem = (item: Omit<GearItemFormState, "id">) => {
    gear.createItem({ ...item, type: sectionKey })
  }

  const updateItem = (item: GearItemFormState) => {
    gear.saveItem({ ...item, type: sectionKey })
  }

  const removeItem = (item: GearItemFormState) => {
    gear.deleteItem({ id: item.id }, { removeChildren: true })
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
