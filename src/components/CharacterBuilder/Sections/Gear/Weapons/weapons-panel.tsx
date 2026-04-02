import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Sections/Gear/Generic/gear-items-list.tsx"
import { useGearByType } from "#/components/Gear/use-gear-api.ts"
import type { WeaponData } from "#/lib/system/gear/weapon-data.ts"
import { GearType } from "#/lib/system/gear-type.ts"

export const WeaponsPanel: FC = () => {
  const weapons = useGearByType<WeaponData>(GearType.weapon)

  return (
    <GearItemsList itemType="Weapon" items={weapons} />
  )
}
