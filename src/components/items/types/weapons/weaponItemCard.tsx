import { RiCheckboxCircleLine, RiCloseCircleLine, RiDeleteBinLine } from "@remixicon/react"
import type { FC } from "react"

import { BasicItemCard } from "#/components/items/card-redesign/basicItemCard.tsx"
import { ItemCardSlot } from "#/components/items/card-redesign/itemCardSlot.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { isFirearmData } from "#/system/gear/weaponData.ts"

interface WeaponItemCardProps {
  weapon: WeaponData
  onOpen?: () => void
}

export const WeaponItemCard: FC<WeaponItemCardProps> = ({
  weapon,
  onOpen,
}) => {
  const dispatch = useRunnerStoreDispatch()
  const accessories = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(weapon.id))

  const toggleEquipped = () => dispatch(Actions.gear.setItem({ ...weapon, equipped: !weapon.equipped }))
  const removeWeapon = () => dispatch(Actions.gear.removeItem({ id: weapon.id, removeChildren: true }))

  return (
    <BasicItemCard
      name={weapon.name}
      onOpen={onOpen}
      statusIcons={{ equipped: weapon.equipped }}
    >
      <ItemCardSlot.Stat label="DV" value={weapon.dmg} type="damage" />
      {weapon.ap && <ItemCardSlot.Stat label="AP" value={weapon.ap} type="damage" />}
      <ItemCardSlot.Stat value={weapon.skill} type="rating" />

      {isFirearmData(weapon) && (
        <>
          <ItemCardSlot.Stat value={weapon.firearmType} type="rating" />

          {weapon.firemodes && (
            <ItemCardSlot.Stat value={weapon.firemodes.join("/")} type="rating" />
          )}
        </>
      )}

      {Object.values(accessories).map((accessory) => (
        <ItemCardSlot.Subitem key={accessory.id} name={accessory.name} />
      ))}

      {weapon.equipped
        ? (
            <ItemCardSlot.QuickAction
              label="Unequip"
              icon={<RiCloseCircleLine size={16} />}
              onClick={toggleEquipped}
            />
          )
        : (
            <ItemCardSlot.QuickAction
              label="Equip"
              icon={<RiCheckboxCircleLine size={16} />}
              onClick={toggleEquipped}
            />
          )}

      <ItemCardSlot.QuickAction
        label="Remove"
        icon={<RiDeleteBinLine size={16} />}
        onClick={removeWeapon}
      />
    </BasicItemCard>
  )
}
