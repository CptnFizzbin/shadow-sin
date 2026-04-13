import type { FC } from "react"

import { GearItemsList } from "#/components/characterBuilder/sections/gear/generic/gearItemsList.tsx"
import { useGearByType } from "#/components/gear/useGearApi.ts"
import { ItemType } from "#/lib/system/itemType.ts"

export const ArmorPanel: FC = () => {
  const armor = useGearByType(ItemType.armor)

  return (
    <GearItemsList items={armor} itemType="Armor" gearType={ItemType.armor} />
  )
}
