import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Grid from "@mui/material/Grid"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import type { FirearmData, WeaponData } from "#/system/gear/weaponData.ts"
import { isFirearmData } from "#/system/gear/weaponData.ts"

interface WeaponSelectSectionProps {
  weapons: WeaponData[]
  selectedWeapon: WeaponData
  onSelectWeapon: (id: string) => void
  selectedFiremode: string | null
  onSelectFiremode: (mode: string) => void
}

export const WeaponSelectSection: FC<WeaponSelectSectionProps> = ({
  weapons,
  selectedWeapon,
  onSelectWeapon,
  selectedFiremode,
  onSelectFiremode,
}) => {
  const firearm = isFirearmData(selectedWeapon) ? (selectedWeapon as FirearmData) : undefined

  return (
    <Stack sx={{ gap: 1.5 }}>
      {weapons.length > 1 && (
        <Paper>
          <List disablePadding>
            {weapons.map((weapon) => (
              <ListItemButton
                key={weapon.id}
                selected={weapon.id === selectedWeapon.id}
                onClick={() => onSelectWeapon(weapon.id)}
              >
                <ListItemText primary={weapon.name} secondary={`${weapon.skill} · DV ${weapon.dmg}`} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}

      <Grid container spacing={1} columns={2}>
        {selectedWeapon.dmg && (
          <Grid size={1}>
            <Label label="DV" variant="outlined" />
            <Typography sx={{ textAlign: "center" }}>{selectedWeapon.dmg}</Typography>
          </Grid>
        )}
        {selectedWeapon.ap !== undefined && selectedWeapon.ap !== 0 && (
          <Grid size={1}>
            <Label label="AP" variant="outlined" />
            <Typography sx={{ textAlign: "center" }}>{selectedWeapon.ap}</Typography>
          </Grid>
        )}
        {firearm?.ammo && (
          <Grid size={1}>
            <Label label="Ammo" variant="outlined" />
            <Typography sx={{ textAlign: "center" }}>
              {firearm.ammo.remaining}/{firearm.ammo.size}
            </Typography>
          </Grid>
        )}
      </Grid>

      {firearm && (firearm.firemodes?.length ?? 0) > 0 && (
        <Stack sx={{ gap: 0.5 }}>
          <Label label="Fire Mode" />
          <ButtonGroup size="small" variant="outlined" fullWidth>
            {firearm.firemodes!.map((mode) => (
              <Button
                key={mode}
                variant={selectedFiremode === mode ? "contained" : "outlined"}
                onClick={() => onSelectFiremode(mode)}
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
    </Stack>
  )
}
