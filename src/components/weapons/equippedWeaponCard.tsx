import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { WeaponAttackDialog } from "#/components/weapons/weaponAttackDialog.tsx"
import type { WeaponData } from "#/lib/system/gear/weaponData.ts"
import { isFirearmData, WeaponType } from "#/lib/system/gear/weaponData.ts"

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

  return (
    <>
      <Paper component={Stack} padding={1} gap={1}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography>{weapon.name}</Typography>

          <Stack direction="row" gap={0.5} alignItems="center">
            {weapon.ap && <WeaponStatChip label={`AP: ${weapon.ap}`} />}
            {weapon.dmg && <Typography color="secondary">DV: {weapon.dmg}</Typography>}
          </Stack>
        </Stack>

        <Stack direction="row" gap={0.5} alignItems="center">
          <Typography color="primary" variant="caption">{weapon.skill}</Typography>
        </Stack>

        <Stack direction="row" gap={0.5} flexWrap="wrap">

          {weapon.weaponType === WeaponType.melee && (
            <WeaponStatChip label="Melee" />
          )}

          {isFirearmData(weapon) && (
            <>
              <WeaponStatChip label={weapon.firearmType} />
              {weapon.firemodes.length > 0 && (
                <WeaponStatChip label={weapon.firemodes.join("/")} />
              )}
              <WeaponStatChip
                label={`Ammo: ${weapon.ammo.remaining}/${weapon.ammo.size}`}
              />
            </>
          )}
        </Stack>

        <Button
          size="small"
          color="error"
          onClick={() => setAttackOpen(true)}
          sx={{ minWidth: 64 }}
        >
          Attack
        </Button>
      </Paper>

      <WeaponAttackDialog
        weapon={weapon}
        open={attackOpen}
        onClose={() => setAttackOpen(false)}
      />
    </>
  )
}
