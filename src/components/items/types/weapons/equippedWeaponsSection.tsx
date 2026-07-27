import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { useGearByType } from "#/lib/hooks/items/gearHooks.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { isWeaponData } from "#/system/gear/weaponData.ts"
import { ItemType } from "#/system/itemType.ts"

import { EquippedWeaponCard } from "./equippedWeaponCard.tsx"

export const EquippedWeaponsSection: FC = () => {
  const allWeapons = useGearByType<WeaponData>(ItemType.weapon)

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
