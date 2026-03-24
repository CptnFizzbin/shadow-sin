import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useBuilderGearSlice } from "#/components/CharacterBuilder/Gear/UseBuilderGearSlice.ts"

export function useWeaponsFormGroup() {
  const gear = useBuilderGearSlice()
  const weapons = gear.getItemsByType<GearItemFormState>("weapons")

  const addWeapon = (item: Omit<GearItemFormState, "id">) => {
    gear.createItem({ ...item, type: "weapons" })
  }

  const updateWeapon = (item: GearItemFormState) => {
    gear.saveItem({ ...item, type: "weapons" })
  }

  const removeWeapon = (item: GearItemFormState) => {
    gear.deleteItem({ id: item.id }, { removeChildren: true })
  }

  return {
    weapons,
    addWeapon,
    updateWeapon,
    removeWeapon,
  }
}
