import { RiCheckboxCircleLine, RiCloseCircleLine } from "@remixicon/react"
import type { FC } from "react"

import { BasicItemDetails } from "#/components/items/details/basicItemDetails.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { isFirearmData } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"

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
  const accessories = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(weapon.id))
  const weaponFormDialog = useWeaponFormDialog()

  const toggleEquipped = () => dispatch(Actions.gear.setItem({ ...weapon, equipped: !weapon.equipped }))

  const removeWeapon = () => {
    dispatch(Actions.gear.removeItem({ id: weapon.id, removeChildren: true }))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await weaponFormDialog.open({ weapon })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <>
      <BasicItemDetails item={weapon} onEdit={handleEdit} onRemove={removeWeapon}>
        <ItemDetailsSlot.Stat label="DV" value={weapon.dmg} type="damage" />
        {weapon.ap && <ItemDetailsSlot.Stat label="AP" value={weapon.ap} type="damage" />}
        <ItemDetailsSlot.Stat label="Skill" value={weapon.skill} type="rating" />

        {isFirearmData(weapon) && (
          <>
            <ItemDetailsSlot.Stat label="Type" value={weapon.firearmType} type="rating" />

            {weapon.firemodes && (
              <ItemDetailsSlot.Stat label="Modes" value={weapon.firemodes.join("/")} type="rating" />
            )}
          </>
        )}

        {Object.values(accessories).map((accessory) => (
          <ItemDetailsSlot.Subitem
            key={accessory.id}
            item={accessory}
            onOpen={onOpenAttachment ? () => onOpenAttachment(accessory) : undefined}
          />
        ))}

        {weapon.equipped
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
      </BasicItemDetails>

      {weaponFormDialog.dialog}
    </>
  )
}
