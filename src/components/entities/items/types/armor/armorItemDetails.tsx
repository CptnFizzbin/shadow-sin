import { RiCheckboxCircleLine, RiCloseCircleLine } from "@remixicon/react"
import type { FC } from "react"

import { useAddItemDialogContext } from "#/components/entities/items/addItemDialogContext.ts"
import { ItemDetailsRoot } from "#/components/entities/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/entities/items/details/itemDetailsSlot.tsx"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ArmorData } from "#/system/model/items/armorData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"

import { useArmorFormDialog } from "./dialogs/armorFormDialog.tsx"

export interface ArmorItemDetailsProps {
  armor: ArmorData
  onRemoved?: () => void
  onOpenAttachment?: (item: ItemData) => void
}

export const ArmorItemDetails: FC<ArmorItemDetailsProps> = ({ armor, onRemoved, onOpenAttachment }) => {
  const dispatch = useRunnerStoreDispatch()
  const mods = useRunnerSelector(ItemSelectors.selectChildrenOf, { itemId: armor.id })
  const armorFormDialog = useArmorFormDialog()
  const addItemDialog = useAddItemDialogContext()

  const toggleEquipped = () => dispatch(Actions.item.setItem({ ...armor, equipped: !armor.equipped }))

  const removeArmor = () => {
    dispatch(Actions.item.removeItem({ id: armor.id, removeChildren: true }))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await armorFormDialog.open({ armor })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  const handleAddMod = () => addItemDialog.open({ parentId: armor.id })

  return (
    <>
      <ItemDetailsRoot item={armor} onEdit={handleEdit} onRemove={removeArmor} onAddSubitem={handleAddMod}>
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

      {armorFormDialog.outlet}
    </>
  )
}
