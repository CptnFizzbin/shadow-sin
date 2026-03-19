import Stack from "@mui/material/Stack"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import { GearItemsList } from "#/components/Character/Form/Gear/Generic/GearItemsList.tsx"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

interface MiscSectionProps {
  form: PlayerCharacterForm
}

export const MiscSection: FC<MiscSectionProps> = ({ form }) => {
  const miscItems = useStore(form.store, ({ values }) => values.gear.misc)

  const addMiscItem = (item: GearItemFormState) => {
    form.setFieldValue("gear.misc", (prev) => [...prev, item])
  }

  const updateMiscItem = (item: GearItemFormState) => {
    form.setFieldValue("gear.misc", (prev) =>
      prev.map((existing) => (existing.id === item.id ? item : existing)),
    )
  }

  const removeMiscItem = (itemId: string) => {
    form.setFieldValue("gear.misc", (prev) =>
      prev.filter((existing) => existing.id !== itemId),
    )
  }

  return (
    <Stack gap={1}>
      <GearItemsList
        items={miscItems}
        onAdd={addMiscItem}
        onUpdate={updateMiscItem}
        onRemove={removeMiscItem}
        label="Item"
      />
    </Stack>
  )
}
