import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useGearApi, useGearByType } from "#/components/Gear/UseGearApi.ts"

export function useArmorState() {
  const gear = useGearApi()
  const armor = useGearByType<GearItemFormState>("armor")

  const addArmor = (item: Omit<GearItemFormState, "id">) => {
    gear.add({ ...item, itemType: "armor" })
  }

  const updateArmor = (item: GearItemFormState) => {
    gear.set({ ...item, itemType: "armor" })
  }

  const removeArmor = (item: GearItemFormState) => {
    gear.remove(item.id, { removeChildren: true })
  }

  return {
    armor,
    addArmor,
    updateArmor,
    removeArmor,
  }
}
