import Stack from "@mui/material/Stack"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import { GearItemsList } from "#/components/Character/Form/Gear/Generic/GearItemsList.tsx"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

interface WeaponsSectionProps {
  form: PlayerCharacterForm
}

export const WeaponsSection: FC<WeaponsSectionProps> = ({ form }) => {
  const weapons = useStore(form.store, ({ values }) => values.gear.weapons)

  const addWeapon = (item: GearItemFormState) => {
    form.setFieldValue("gear.weapons", (prev) => [...prev, item])
  }

  const updateWeapon = (item: GearItemFormState) => {
    form.setFieldValue("gear.weapons", (prev) =>
      prev.map((existing) => (existing.id === item.id ? item : existing)),
    )
  }

  const removeWeapon = (itemId: string) => {
    form.setFieldValue("gear.weapons", (prev) =>
      prev.filter((existing) => existing.id !== itemId),
    )
  }

  return (
    <Stack gap={1}>
      <GearItemsList
        items={weapons}
        onAdd={addWeapon}
        onUpdate={updateWeapon}
        onRemove={removeWeapon}
        label="Weapon"
      />
    </Stack>
  )
}
