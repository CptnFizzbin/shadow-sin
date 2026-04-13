import type { FC } from "react"

import { GearItemsList } from "#/components/characterBuilder/sections/gear/generic/gearItemsList.tsx"
import { useGearByType } from "#/components/gear/useGearApi.ts"
import { GearType } from "#/lib/system/gearType.ts"

export const MiscPanel: FC = () => {
  const otherItems = useGearByType(GearType.other)

  return (
    <GearItemsList items={otherItems} itemType="Item" gearType={GearType.other} />
  )
}
