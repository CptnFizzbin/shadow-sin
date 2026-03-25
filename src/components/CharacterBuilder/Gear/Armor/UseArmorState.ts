import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useBuilderGearApi } from "#/components/CharacterBuilder/Gear/UseBuilderGearApi.ts"

export function useArmorState() {
  const gear = useBuilderGearApi()
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
