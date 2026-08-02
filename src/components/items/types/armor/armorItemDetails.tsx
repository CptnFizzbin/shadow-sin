import { RiCheckboxCircleLine, RiCloseCircleLine } from "@remixicon/react"
import type { FC } from "react"

import { ItemDetailsRoot } from "#/components/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useArmorFormDialog } from "./dialogs/armorFormDialog.tsx"

export interface ArmorItemDetailsProps {
  armor: ArmorData
  onRemoved?: () => void
  onOpenAttachment?: (item: ItemData) => void
}

export const ArmorItemDetails: FC<ArmorItemDetailsProps> = ({ armor, onRemoved, onOpenAttachment }) => {
  const dispatch = useRunnerStoreDispatch()
  const mods = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(armor.id))
  const armorFormDialog = useArmorFormDialog()

  const toggleEquipped = () => dispatch(Actions.gear.setItem({ ...armor, equipped: !armor.equipped }))

  const removeArmor = () => {
    dispatch(Actions.gear.removeItem({ id: armor.id, removeChildren: true }))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await armorFormDialog.open({ armor })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <>
      <ItemDetailsRoot item={armor} onEdit={handleEdit} onRemove={removeArmor}>
        <ItemDetailsSlot.Stat label="Ballistic" value={armor.ballistic} type="damage" />
        <ItemDetailsSlot.Stat label="Impact" value={armor.impact} type="damage" />

        {Object.values(mods).map((mod) => (
          <ItemDetailsSlot.Subitem
            key={mod.id}
            item={mod}
            onOpen={onOpenAttachment ? () => onOpenAttachment(mod) : undefined}
          />
        ))}

        {armor.equipped
          ? (
              <ItemDetailsSlot.QuickAction
                label="Unequip"
                icon={<RiCloseCircleLine size={16} />}
                onClick={toggleEquipped}
              />
            )
          : (
              <ItemDetailsSlot.QuickAction
                label="Equip"
                icon={<RiCheckboxCircleLine size={16} />}
                onClick={toggleEquipped}
              />
            )}
      </ItemDetailsRoot>

      {armorFormDialog.dialog}
    </>
  )
}
