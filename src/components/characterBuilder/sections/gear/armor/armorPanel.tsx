import type { FC } from "react"

import { GearItemsList } from "#/components/characterBuilder/sections/gear/generic/gearItemsList.tsx"
import { useGearByType } from "#/components/gear/useGearApi.ts"
import { GearType } from "#/lib/system/gearType.ts"

export const ArmorPanel: FC = () => {
  const armor = useGearByType(GearType.armor)

  return (
    <GearItemsList items={armor} itemType="Armor" gearType={GearType.armor} />
  )
}
