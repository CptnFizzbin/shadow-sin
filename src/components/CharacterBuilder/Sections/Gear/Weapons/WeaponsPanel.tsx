import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Sections/Gear/Generic/GearItemsList.tsx"
import { useGearByType } from "#/components/Gear/UseGearApi.ts"
import type { WeaponData } from "#/lib/system/gear/weaponData.ts"
import { GearType } from "#/lib/system/gearType.ts"

export const WeaponsPanel: FC = () => {
  const weapons = useGearByType<WeaponData>(GearType.weapon)

  return (
    <GearItemsList itemType="Weapon" items={weapons} />
  )
}
