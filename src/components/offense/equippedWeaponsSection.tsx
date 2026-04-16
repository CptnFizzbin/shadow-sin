import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useGearByType } from "#/components/gear/useGearApi.ts"
import { EquippedWeaponCard } from "#/components/offense/equippedWeaponCard.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import type { WeaponData } from "#/lib/system/gear/weaponData.ts"
import { isWeaponData } from "#/lib/system/gear/weaponData.ts"
import { GearType } from "#/lib/system/gearType.ts"

export const EquippedWeaponsSection: FC = () => {
  const allWeapons = useGearByType<WeaponData>(GearType.weapon)

  const equippedWeapons = allWeapons.filter(
    (weapon) => !weapon.parentId && isWeaponData(weapon) && weapon.equipped,
  )

  if (equippedWeapons.length === 0) {
    return (
      <Stack gap={0.5}>
        <Label label="Weapons" />
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ py: 2 }}
        >
          No weapons equipped. Equip weapons from the Gear page.
        </Typography>
      </Stack>
    )
  }

  return (
    <Stack gap={1}>
      <Label label="Weapons" />
      {equippedWeapons.map((weapon) => (
        <EquippedWeaponCard key={weapon.id} weapon={weapon} />
      ))}
    </Stack>
  )
}
