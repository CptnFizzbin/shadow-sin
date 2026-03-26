import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useGearApi } from "#/components/Gear/UseGearApi.ts"

export function useWeaponsState() {
  const gear = useGearApi()
  const weapons = gear.getByType<GearItemFormState>("weapons")

  const addWeapon = (item: Omit<GearItemFormState, "id">) => {
    gear.add({ ...item, itemType: "weapons" })
  }

  const updateWeapon = (item: GearItemFormState) => {
    gear.set({ ...item, itemType: "weapons" })
  }

  const removeWeapon = (item: GearItemFormState) => {
    gear.remove(item.id, { removeChildren: true })
  }

  return {
    weapons,
    addWeapon,
    updateWeapon,
    removeWeapon,
  }
}
