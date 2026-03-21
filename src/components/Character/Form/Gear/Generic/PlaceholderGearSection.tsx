import Stack from "@mui/material/Stack"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import { GearItemsList } from "#/components/Character/Form/Gear/Generic/GearItemsList.tsx"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

type GearItemSectionField =
  | "gear.weapons"
  | "gear.armor"
  | "gear.vehicles"
  | "gear.cyberware"
  | "gear.misc"

interface PlaceholderGearSectionProps {
  form: PlayerCharacterForm
  field: GearItemSectionField
  label: string
}

export const PlaceholderGearSection: FC<PlaceholderGearSectionProps> = ({
  form,
  field,
  label,
}) => {
  const sectionKey = field.split(".")[1] as
    | "weapons"
    | "armor"
    | "vehicles"
    | "cyberware"
    | "misc"

  const items = useStore(form.store, ({ values }) => values.gear[sectionKey])

  const addItem = (item: GearItemFormState) => {
    form.setFieldValue(field, (prev: GearItemFormState[]) => [...prev, item])
  }

  const updateItem = (item: GearItemFormState) => {
    form.setFieldValue(field, (prev: GearItemFormState[]) =>
      prev.map((existing) => (existing.id === item.id ? item : existing)),
    )
  }

  const removeItem = (itemId: string) => {
    form.setFieldValue(field, (prev: GearItemFormState[]) =>
      prev.filter((existing) => existing.id !== itemId),
    )
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
