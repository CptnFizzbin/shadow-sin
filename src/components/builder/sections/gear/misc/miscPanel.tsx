import type { FC } from "react"

import { ItemsList } from "#/components/builder/sections/gear/generic/itemsList.tsx"
import { useGearByType } from "#/components/items/useGearStore.ts"
import { ItemType } from "#/system/itemType.ts"

export const MiscPanel: FC = () => {
  const otherItems = useGearByType(ItemType.other)

  return (
    <ItemsList items={otherItems} itemLabel="Item" itemType={ItemType.other} />
  )
}
