import Stack from "@mui/material/Stack"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import { GearItemsList } from "#/components/Character/Form/Gear/Generic/GearItemsList.tsx"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

interface CyberwareSectionProps {
  form: PlayerCharacterForm
}

export const CyberwareSection: FC<CyberwareSectionProps> = ({ form }) => {
  const cyberware = useStore(form.store, ({ values }) => values.gear.cyberware)

  const addCyberware = (item: GearItemFormState) => {
    form.setFieldValue("gear.cyberware", (prev) => [...prev, item])
  }

  const updateCyberware = (item: GearItemFormState) => {
    form.setFieldValue("gear.cyberware", (prev) =>
      prev.map((existing) => (existing.id === item.id ? item : existing)),
    )
  }

  const removeCyberware = (itemId: string) => {
    form.setFieldValue("gear.cyberware", (prev) =>
      prev.filter((existing) => existing.id !== itemId),
    )
  }

  return (
    <Stack gap={1}>
      <GearItemsList
        items={cyberware}
        onAdd={addCyberware}
        onUpdate={updateCyberware}
        onRemove={removeCyberware}
        label="Cyberware"
      />
    </Stack>
  )
}
