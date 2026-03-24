import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useBuilderGearApi } from "#/components/CharacterBuilder/Gear/UseBuilderGearApi.ts"

export function useWeaponsState() {
  const gear = useBuilderGearApi()
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
