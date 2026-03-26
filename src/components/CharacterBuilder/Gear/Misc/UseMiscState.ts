import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useGearApi } from "#/components/Gear/UseGearApi.ts"

export function useMiscState() {
  const gear = useGearApi()
  const misc = gear.getByType<GearItemFormState>("misc")

  const addMiscItem = (item: Omit<GearItemFormState, "id">) => {
    gear.create({ ...item, itemType: "misc" })
  }

  const updateMiscItem = (item: GearItemFormState) => {
    gear.set({ ...item, itemType: "misc" })
  }

  const removeMiscItem = (item: GearItemFormState) => {
    gear.remove(item.id, { removeChildren: true })
  }

  return {
    misc,
    addMiscItem,
    updateMiscItem,
    removeMiscItem,
  }
}
