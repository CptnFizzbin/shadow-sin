import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useBuilderGearApi } from "#/components/CharacterBuilder/Gear/UseBuilderGearApi.ts"

export function useMiscState() {
  const gear = useBuilderGearApi()
  const misc = gear.getItemsByType<GearItemFormState>("misc")

  const addMiscItem = (item: Omit<GearItemFormState, "id">) => {
    gear.createItem({ ...item, type: "misc" })
  }

  const updateMiscItem = (item: GearItemFormState) => {
    gear.saveItem({ ...item, type: "misc" })
  }

  const removeMiscItem = (item: GearItemFormState) => {
    gear.deleteItem({ id: item.id }, { removeChildren: true })
  }

  return {
    misc,
    addMiscItem,
    updateMiscItem,
    removeMiscItem,
  }
}
