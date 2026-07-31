import type { FC } from "react"

import { BasicItemCard } from "#/components/items/card-redesign/basicItemCard.tsx"
import { ItemCardSlot } from "#/components/items/card-redesign/itemCardSlot.tsx"
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
  const accessories = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(weapon.id))

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
    </BasicItemCard>
  )
}
