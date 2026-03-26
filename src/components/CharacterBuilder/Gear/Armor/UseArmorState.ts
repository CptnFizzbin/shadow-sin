import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useGearApi } from "#/components/Gear/UseGearApi.ts"

export function useArmorState() {
  const gear = useGearApi()
  const armor = gear.getByType<GearItemFormState>("armor")

  const addArmor = (item: Omit<GearItemFormState, "id">) => {
    gear.create({ ...item, itemType: "armor" })
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
