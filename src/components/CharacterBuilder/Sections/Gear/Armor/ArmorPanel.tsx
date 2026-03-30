import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Sections/Gear/Generic/GearItemsList.tsx"
import { useGearByType } from "#/components/Gear/UseGearApi.ts"
import { GearType } from "#/lib/system/gearType.ts"

export const ArmorPanel: FC = () => {
  const armor = useGearByType(GearType.armor)

  return (
    <GearItemsList items={armor} itemType="Armor" />
  )
}
