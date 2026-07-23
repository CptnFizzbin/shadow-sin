import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import type { RemixiconComponentType } from "@remixicon/react"
import { RiFireLine, RiFocusLine, RiArrowRightSLine, RiSwordLine } from "@remixicon/react"
import type { FC } from "react"

import type { WeaponData } from "#/system/gear/weaponData.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"

interface WeaponAttackHubListProps {
  weapons: WeaponData[]
  onSelectWeapon: (weaponId: string) => void
}

const iconByWeaponType: Record<WeaponType, RemixiconComponentType> = {
  [WeaponType.melee]: RiSwordLine,
  [WeaponType.firearm]: RiFireLine,
  [WeaponType.thrown]: RiFocusLine,
  [WeaponType.projectile]: RiFocusLine,
  [WeaponType.exotic]: RiFocusLine,
  [WeaponType.other]: RiFocusLine,
}

/** Landing view of the Attack Calculator: one row per equipped weapon. */
export const WeaponAttackHubList: FC<WeaponAttackHubListProps> = ({ weapons, onSelectWeapon }) => (
  <Paper>
    <List disablePadding>
      {weapons.map((weapon, index) => {
        const Icon = iconByWeaponType[weapon.weaponType] ?? RiFocusLine

        return (
          <ListItem
            key={weapon.id}
            disablePadding
            divider={index < weapons.length - 1}
            secondaryAction={(
              <RiArrowRightSLine size={18} style={{ color: "var(--mui-palette-text-secondary)" }} />
            )}
          >
            <ListItemButton onClick={() => onSelectWeapon(weapon.id)} sx={{ minHeight: 56 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Icon size={20} />
              </ListItemIcon>
              <ListItemText primary={weapon.name} secondary={`${weapon.skill} · DV ${weapon.dmg}`} />
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  </Paper>
)
