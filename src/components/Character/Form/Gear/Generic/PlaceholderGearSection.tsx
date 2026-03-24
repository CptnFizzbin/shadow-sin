import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useCharacterBuilderStoreSlice } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { GearItemsList } from "#/components/Character/Form/Gear/Generic/GearItemsList.tsx"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"

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

  const itemsSlice = useCharacterBuilderStoreSlice(
    (state) => state.gear[sectionKey],
    (state, newValue) => {
      state.gear[sectionKey] = newValue
      return state
    },
  )

  const addItem = (item: GearData) => {
    itemsSlice.update((prev: GearData[]) => [...prev, item])
  }

  const updateItem = (item: GearData) => {
    itemsSlice.update((draft) =>
      draft.map((existing) => (existing.id === item.id ? item : existing)),
    )
  }

  const removeItem = (itemId: string) => {
    itemsSlice.update((draft) =>
      draft.filter((existing) => existing.id !== itemId),
    )
  }

  return (
    <Stack gap={1}>
      <GearItemsList
        items={itemsSlice.state}
        onAdd={addItem}
        onUpdate={updateItem}
        onRemove={removeItem}
        label={label}
      />
    </Stack>
  )
}
