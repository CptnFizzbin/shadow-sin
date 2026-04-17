import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { AttackDicePool } from "#/components/offense/attackDicePool.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import type { FirearmData, WeaponData } from "#/lib/system/gear/weaponData.ts"
import { isFirearmData } from "#/lib/system/gear/weaponData.ts"

interface WeaponAttackDialogProps {
  weapon: WeaponData
  open: boolean
  onClose: () => void
}

export const WeaponAttackDialog: FC<WeaponAttackDialogProps> = ({
  weapon,
  open,
  onClose,
}) => {
  const isFirearm = isFirearmData(weapon)
  const firearm = isFirearm ? (weapon as FirearmData) : undefined

  const [selectedFiremode, setSelectedFiremode] = useState<string | null>(
    firearm?.firemodes[0] ?? null,
  )

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 0 }}>{weapon.name}</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Stack gap={1.5}>
          {isFirearm && firearm && firearm.firemodes.length > 0 && (
            <Stack gap={0.5}>
              <Label label="Fire Mode" />
              <ButtonGroup size="small" variant="outlined" fullWidth>
                {firearm.firemodes.map((mode) => (
                  <Button
                    key={mode}
                    variant={selectedFiremode === mode ? "contained" : "outlined"}
                    onClick={() => setSelectedFiremode(mode)}
                  >
                    {mode}
                  </Button>
                ))}
              </ButtonGroup>
              {selectedFiremode && (
                <UnderConstruction
                  title="Fire Mode Effects"
                  description="Fire mode modifiers (recoil, burst fire DV bonus, suppressive fire) are not yet implemented."
                />
              )}
            </Stack>
          )}

          <Grid container spacing={1} columns={2}>
            {weapon.dmg && (
              <Grid size={1}>
                <Label label="DV" variant="outlined" />
                <Typography textAlign="center">{weapon.dmg}</Typography>
              </Grid>
            )}
            {weapon.ap !== undefined && weapon.ap !== 0 && (
              <Grid size={1}>
                <Label label="AP" variant="outlined" />
                <Typography textAlign="center">{weapon.ap}</Typography>
              </Grid>
            )}
            {isFirearm && firearm && (
              <Grid size={1}>
                <Label label="Ammo" variant="outlined" />
                <Typography textAlign="center">
                  {firearm.ammo.remaining}/{firearm.ammo.size}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Divider />

          <AttackDicePool weapon={weapon} />

          <Button onClick={onClose} color="secondary" size="small">
            Close
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
