import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Sections/Gear/Generic/GearItemsList.tsx"
import { useGearByType } from "#/components/Gear/UseGearApi.ts"
import { GearType } from "#/lib/system/gearType.ts"

export const MiscPanel: FC = () => {
  const otherItems = useGearByType(GearType.other)

  return (
    <GearItemsList items={otherItems} itemType="Item" />
  )
}
