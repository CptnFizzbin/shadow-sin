import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useBuilderGearSlice } from "#/components/CharacterBuilder/Gear/UseBuilderGearSlice.ts"

export function useMiscFormGroup() {
  const gear = useBuilderGearSlice()
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
