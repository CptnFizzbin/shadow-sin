import type { FC } from "react"

import { ItemCard } from "#/components/items/card-redesign/itemCard.tsx"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { isFirearmData } from "#/system/gear/weaponData.ts"

interface WeaponItemCardProps {
  weapon: WeaponData
}

export const WeaponItemCard: FC<WeaponItemCardProps> = ({
  weapon,
}) => {
  const accessories = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(weapon.id))

  return (
    <ItemCard name={weapon.name}>
      <ItemCard.StatusIcons equipped={weapon.equipped} />

      <ItemCard.Stat label="DV" value={weapon.dmg} type="damage" />
      {weapon.ap && <ItemCard.Stat label="AP" value={weapon.ap} type="damage" />}
      <ItemCard.Stat value={weapon.skill} type="rating" />

      {isFirearmData(weapon) && (
        <>
          <ItemCard.Stat value={weapon.firearmType} type="rating" />

          {weapon.firemodes && (
            <ItemCard.Stat value={weapon.firemodes.join("/")} type="rating" />
          )}
        </>
      )}

      {Object.values(accessories).map((accessory) => (
        <ItemCard.Subitem key={accessory.id} name={accessory.name} />
      ))}
    </ItemCard>
  )
}
