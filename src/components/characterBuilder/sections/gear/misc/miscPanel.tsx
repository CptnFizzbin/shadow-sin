import type { FC } from "react"

import { GearItemsList } from "#/components/characterBuilder/sections/gear/generic/gearItemsList.tsx"
import { useGearByType } from "#/components/gear/useGearApi.ts"
import { ItemType } from "#/lib/system/itemType.ts"

export const MiscPanel: FC = () => {
  const otherItems = useGearByType(ItemType.other)

  return (
    <GearItemsList items={otherItems} itemType="Item" gearType={ItemType.other} />
  )
}
