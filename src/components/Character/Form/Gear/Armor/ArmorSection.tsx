import Stack from "@mui/material/Stack"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import { GearItemsList } from "#/components/Character/Form/Gear/Generic/GearItemsList.tsx"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

interface ArmorSectionProps {
  form: PlayerCharacterForm
}

export const ArmorSection: FC<ArmorSectionProps> = ({ form }) => {
  const armorItems = useStore(form.store, ({ values }) => values.gear.armor)

  const addArmor = (item: GearItemFormState) => {
    form.setFieldValue("gear.armor", (prev) => [...prev, item])
  }

  const updateArmor = (item: GearItemFormState) => {
    form.setFieldValue("gear.armor", (prev) =>
      prev.map((existing) => (existing.id === item.id ? item : existing)),
    )
  }

  const removeArmor = (itemId: string) => {
    form.setFieldValue("gear.armor", (prev) =>
      prev.filter((existing) => existing.id !== itemId),
    )
  }

  return (
    <Stack gap={1}>
      <GearItemsList
        items={armorItems}
        onAdd={addArmor}
        onUpdate={updateArmor}
        onRemove={removeArmor}
        label="Armor"
      />
    </Stack>
  )
}
