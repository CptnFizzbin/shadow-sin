import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { WeaponAttackDialog } from "#/components/offense/weaponAttackDialog.tsx"
import type { FirearmData, WeaponData } from "#/lib/system/gear/weaponData.ts"
import { WeaponType, isFirearmData } from "#/lib/system/gear/weaponData.ts"

interface WeaponStatChipProps {
  label: string
}

const WeaponStatChip: FC<WeaponStatChipProps> = ({ label }) => (
  <Chip
    label={label}
    size="small"
    variant="outlined"
    sx={{ height: 20, fontSize: "0.7rem" }}
  />
)

interface EquippedWeaponCardProps {
  weapon: WeaponData
}

export const EquippedWeaponCard: FC<EquippedWeaponCardProps> = ({ weapon }) => {
  const [attackOpen, setAttackOpen] = useState(false)
  const isFirearm = isFirearmData(weapon)
  const firearm = isFirearm ? (weapon as FirearmData) : undefined

  return (
    <>
      <Stack
        gap={0.5}
        sx={{
          padding: 1,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography sx={{ flexGrow: 1, fontSize: "0.875rem", fontWeight: "medium" }}>
            {weapon.name}
          </Typography>

          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => setAttackOpen(true)}
            sx={{ minWidth: 64 }}
          >
            Attack
          </Button>
        </Stack>

        <Stack direction="row" gap={0.5} flexWrap="wrap">
          {weapon.dmg && <WeaponStatChip label={`DV: ${weapon.dmg}`} />}
          {weapon.ap !== undefined && weapon.ap !== 0 && (
            <WeaponStatChip label={`AP: ${weapon.ap}`} />
          )}
          {weapon.skill && <WeaponStatChip label={weapon.skill} />}
          {weapon.weaponType === WeaponType.melee && (
            <WeaponStatChip label="Melee" />
          )}
          {isFirearm && firearm && (
            <>
              <WeaponStatChip label={firearm.firearmType} />
              {firearm.firemodes.length > 0 && (
                <WeaponStatChip label={firearm.firemodes.join("/")} />
              )}
              <WeaponStatChip
                label={`Ammo: ${firearm.ammo.remaining}/${firearm.ammo.size}`}
              />
            </>
          )}
        </Stack>
      </Stack>

      <WeaponAttackDialog
        weapon={weapon}
        open={attackOpen}
        onClose={() => setAttackOpen(false)}
      />
    </>
  )
}
