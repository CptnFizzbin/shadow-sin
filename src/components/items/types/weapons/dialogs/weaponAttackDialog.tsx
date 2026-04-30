import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { AttackDicePool } from "#/components/system/dicePool/dicePools/attackDicePool.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import type { FirearmData, WeaponData } from "#/system/gear/weaponData.ts"
import { isFirearmData } from "#/system/gear/weaponData.ts"

interface WeaponAttackDialogProps {
  weapon: WeaponData
  open: boolean
  onClose: () => void
  onClosed?: () => void
}

const WeaponAttackDialog: FC<WeaponAttackDialogProps> = ({
  weapon,
  open,
  onClose,
  onClosed,
}) => {
  const isFirearm = isFirearmData(weapon)
  const firearm = isFirearm ? (weapon as FirearmData) : undefined

  const [selectedFiremode, setSelectedFiremode] = useState<string | null>(
    firearm?.firemodes[0] ?? null,
  )

  return (
    <Dialog open={open} onClose={onClose} onClosed={onClosed} maxWidth="sm">
      <Dialog.Title>{weapon.name}</Dialog.Title>
      <Dialog.Content>
        <Stack sx={{ gap: 1.5 }}>
          {isFirearm && firearm && firearm.firemodes.length > 0 && (
            <Stack sx={{ gap: 0.5 }}>
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
                <Typography sx={{ textAlign: "center" }}>{weapon.dmg}</Typography>
              </Grid>
            )}
            {weapon.ap !== undefined && weapon.ap !== 0 && (
              <Grid size={1}>
                <Label label="AP" variant="outlined" />
                <Typography sx={{ textAlign: "center" }}>{weapon.ap}</Typography>
              </Grid>
            )}
            {isFirearm && firearm && (
              <Grid size={1}>
                <Label label="Ammo" variant="outlined" />
                <Typography sx={{ textAlign: "center" }}>
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
      </Dialog.Content>
    </Dialog>
  )
}

type UseWeaponAttackDialogProps = Omit<WeaponAttackDialogProps, "open" | "onClose" | "onClosed">

export const useWeaponAttackDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseWeaponAttackDialogProps) => dialogApi.open<void>(
      (ctrl, open) => (
        <WeaponAttackDialog
          open={open}
          onClose={() => ctrl.close()}
          onClosed={() => ctrl.onClosed()}
          {...props}
        />
      ),
    ),
  }
}
