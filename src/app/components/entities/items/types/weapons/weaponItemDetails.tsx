import type { FC } from "react"

import { useAddItemDialogContext } from "#app/components/entities/items/addItemDialogContext.ts"
import { ItemDetailsRoot } from "#app/components/entities/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#app/components/entities/items/details/itemDetailsSlot.tsx"
import type { ItemData } from "#data/items/itemData.ts"
import type { WeaponData } from "#data/items/weaponData.ts"
import { isFirearmData, isMeleeWeaponData } from "#data/items/weaponData.ts"
import { isNewItem } from "#state/runner/items/items.actions.ts"
import { ItemSelectors } from "#state/runner/items/items.selector.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

import { useWeaponFormDialog } from "./dialogs/weaponFormDialog.tsx"

export interface WeaponItemDetailsProps {
  weapon: WeaponData
  onRemoved?: () => void
  /** Called with an accessory when its nested subitem card is tapped, to navigate to its own details page. */
  onOpenAttachment?: (item: ItemData) => void
}

export const WeaponItemDetails: FC<WeaponItemDetailsProps> = ({
  weapon,
  onRemoved,
  onOpenAttachment,
}) => {
  const dispatch = useRunnerStoreDispatch()
  const accessories = useRunnerSelector(ItemSelectors.selectChildrenOf, { itemId: weapon.id })
  const weaponFormDialog = useWeaponFormDialog()
  const addItemDialog = useAddItemDialogContext()

  const removeWeapon = () => {
    dispatch(Actions.item.removeItem({ id: weapon.id, removeChildren: true }))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await weaponFormDialog.open({ weapon })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  const handleAddAccessory = () => addItemDialog.open({ parentId: weapon.id })

  return (
    <>
      <ItemDetailsRoot item={weapon} onEdit={handleEdit} onRemove={removeWeapon} onAddSubitem={handleAddAccessory}>
        <ItemDetailsSlot.Stat label="DV" value={weapon.dmg} type="damage" />
        {weapon.ap && <ItemDetailsSlot.Stat label="AP" value={weapon.ap} type="damage" />}
        {weapon.dmgType && <ItemDetailsSlot.Stat label="Dmg Type" value={weapon.dmgType} />}
        <ItemDetailsSlot.Stat label="Skill" value={weapon.skill} type="rating" />
        {weapon.attribute && <ItemDetailsSlot.Stat label="Attribute" value={weapon.attribute} />}

        {isFirearmData(weapon) && (
          <>
            <ItemDetailsSlot.Stat label="Type" value={weapon.firearmType} type="rating" />

            {weapon.firemodes && (
              <ItemDetailsSlot.Stat label="Modes" value={weapon.firemodes.join("/")} type="rating" />
            )}

            <ItemDetailsSlot.Stat label="RC" value={weapon.recoil} />

            {weapon.attachmentPoints && (
              <ItemDetailsSlot.Stat label="Mounts" value={weapon.attachmentPoints.join("/")} />
            )}

            {weapon.ammo && (
              <ItemDetailsSlot.Stat label="Ammo" value={`${weapon.ammo.remaining}/${weapon.ammo.size} (${weapon.ammo.type})`} />
            )}
          </>
        )}

        {isMeleeWeaponData(weapon) && (
          <>
            <ItemDetailsSlot.Stat label="Reach" value={weapon.reach} />
            {weapon.meleeType && <ItemDetailsSlot.Stat label="Type" value={weapon.meleeType} />}
          </>
        )}

        {Object.values(accessories).map((accessory) => (
          <ItemDetailsSlot.Subitem
            key={accessory.id}
            item={accessory}
            onOpen={onOpenAttachment ? () => onOpenAttachment(accessory) : undefined}
          />
        ))}
      </ItemDetailsRoot>

      {weaponFormDialog.outlet}
    </>
  )
}
