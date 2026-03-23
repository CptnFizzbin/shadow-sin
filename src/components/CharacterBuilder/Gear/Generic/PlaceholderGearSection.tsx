import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useCharacterBuilderStoreSlice } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { GearItemsList } from "#/components/CharacterBuilder/Gear/Generic/GearItemsList.tsx"

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

  const addItem = (item: GearItemFormState) => {
    itemsSlice.update((prev: GearItemFormState[]) => {
      return [...prev, { ...item, id: crypto.randomUUID() }]
    })
  }

  const updateItem = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      return draft.map((existing) =>
        existing.id === item.id ? item : existing,
      )
    })
  }

  const removeItem = (itemId: string) => {
    itemsSlice.update((draft) => {
      return draft.filter((existing) => existing.id !== itemId)
    })
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
