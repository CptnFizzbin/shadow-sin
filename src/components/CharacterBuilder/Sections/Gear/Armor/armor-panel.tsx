import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Sections/Gear/Generic/gear-items-list.tsx"
import { useGearByType } from "#/components/Gear/use-gear-api.ts"
import { GearType } from "#/lib/system/gear-type.ts"

export const ArmorPanel: FC = () => {
  const armor = useGearByType(GearType.armor)

  return (
    <GearItemsList items={armor} itemType="Armor" />
  )
}
