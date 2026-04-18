import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useGearByType } from "#/components/gear/useGearApi.ts"
import { Label } from "#/components/ui/text/label.tsx"
import type { WeaponData } from "#/lib/system/gear/weaponData.ts"
import { isWeaponData } from "#/lib/system/gear/weaponData.ts"
import { GearType } from "#/lib/system/gearType.ts"
import { EquippedWeaponCard } from "./equippedWeaponCard.tsx"

export const EquippedWeaponsSection: FC = () => {
  const allWeapons = useGearByType<WeaponData>(GearType.weapon)

  const equippedWeapons = allWeapons.filter(
    (weapon) => !weapon.parentId && isWeaponData(weapon) && weapon.equipped,
  )

  if (equippedWeapons.length === 0) {
    return (
      <Stack sx={{ gap: 0.5 }}>
        <Label label="Weapons" />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 2 }}
        >
          No weapons equipped. Equip weapons from the Gear page.
        </Typography>
      </Stack>
    )
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Label label="Weapons" />
      {equippedWeapons.map((weapon) => (
        <EquippedWeaponCard key={weapon.id} weapon={weapon} />
      ))}
    </Stack>
  )
}
