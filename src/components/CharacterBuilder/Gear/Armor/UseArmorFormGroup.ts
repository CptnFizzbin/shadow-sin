import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useBuilderGearSlice } from "#/components/CharacterBuilder/Gear/UseBuilderGearSlice.ts"

export function useArmorFormGroup() {
  const gear = useBuilderGearSlice()
  const armor = gear.getItemsByType<GearItemFormState>("armor")

  const addArmor = (item: Omit<GearItemFormState, "id">) => {
    gear.createItem({ ...item, type: "armor" })
  }

  const updateArmor = (item: GearItemFormState) => {
    gear.saveItem({ ...item, type: "armor" })
  }

  const removeArmor = (item: GearItemFormState) => {
    gear.deleteItem(item, { removeChildren: true })
  }

  return {
    armor,
    addArmor,
    updateArmor,
    removeArmor,
  }
}
