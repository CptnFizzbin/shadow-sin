import { RiCheckboxCircleLine, RiCloseCircleLine } from "@remixicon/react"
import type { FC } from "react"

import { DataCard } from "#/components/dataCard/dataCard.tsx"
import { ItemDataCardRoot } from "#/components/itemCard/itemDataCardRoot.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { isFirearmData } from "#/system/gear/weaponData.ts"
import { isEquipped } from "#/system/items/itemUtils.ts"

interface WeaponDataCardProps {
  weapon: WeaponData
  onOpen?: () => void
  onEdit?: () => void
}

export const WeaponDataCard: FC<WeaponDataCardProps> = ({
  weapon,
  onOpen,
  onEdit,
}) => {
  const dispatch = useRunnerStoreDispatch()
  const accessories = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(weapon.id))

  const toggleEquipped = () => dispatch(Actions.item.setEquipped({ id: weapon.id, equipped: !isEquipped(weapon) }))
  const removeWeapon = () => dispatch(Actions.gear.removeItem({ id: weapon.id, removeChildren: true }))

  return (
    <ItemDataCardRoot item={weapon} onOpen={onOpen} onEdit={onEdit} onRemove={removeWeapon}>
      <DataCard.Stat label="DV" value={weapon.dmg} type="damage" />
      {weapon.ap && <DataCard.Stat label="AP" value={weapon.ap} type="damage" />}
      <DataCard.Stat value={weapon.skill} type="rating" />

      {isFirearmData(weapon) && (
        <>
          <DataCard.Stat value={weapon.firearmType} type="rating" />

          {weapon.firemodes && (
            <DataCard.Stat value={weapon.firemodes.join("/")} type="rating" />
          )}
        </>
      )}

      {Object.values(accessories).map((accessory) => (
        <DataCard.Subitem key={accessory.id} name={accessory.name} />
      ))}

      {isEquipped(weapon)
        ? (
            <DataCard.QuickAction
              label="Unequip"
              icon={<RiCloseCircleLine size={16} />}
              onClick={toggleEquipped}
            />
          )
        : (
            <DataCard.QuickAction
              label="Equip"
              icon={<RiCheckboxCircleLine size={16} />}
              onClick={toggleEquipped}
            />
          )}
    </ItemDataCardRoot>
  )
}
