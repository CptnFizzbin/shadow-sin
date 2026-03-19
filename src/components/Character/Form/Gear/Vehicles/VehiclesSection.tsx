import Stack from "@mui/material/Stack"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import { GearItemsList } from "#/components/Character/Form/Gear/Generic/GearItemsList.tsx"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

interface VehiclesSectionProps {
  form: PlayerCharacterForm
}

export const VehiclesSection: FC<VehiclesSectionProps> = ({ form }) => {
  const vehicles = useStore(form.store, ({ values }) => values.gear.vehicles)

  const addVehicle = (item: GearItemFormState) => {
    form.setFieldValue("gear.vehicles", (prev) => [...prev, item])
  }

  const updateVehicle = (item: GearItemFormState) => {
    form.setFieldValue("gear.vehicles", (prev) =>
      prev.map((existing) => (existing.id === item.id ? item : existing)),
    )
  }

  const removeVehicle = (itemId: string) => {
    form.setFieldValue("gear.vehicles", (prev) =>
      prev.filter((existing) => existing.id !== itemId),
    )
  }

  return (
    <Stack gap={1}>
      <GearItemsList
        items={vehicles}
        onAdd={addVehicle}
        onUpdate={updateVehicle}
        onRemove={removeVehicle}
        label="Vehicle"
      />
    </Stack>
  )
}
