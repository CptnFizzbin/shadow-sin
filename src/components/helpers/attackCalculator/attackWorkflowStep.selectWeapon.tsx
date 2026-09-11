import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import type { RemixiconComponentType } from "@remixicon/react"
import { RiArrowRightSLine, RiFireLine, RiFocusLine, RiSwordLine } from "@remixicon/react"
import type { FC } from "react"

import { useEntitySelector } from "#/contexts/entity/entityProvider.tsx"
import { ItemSelectors } from "#/stores/runner/gear/gearSlice.selectors.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"
import { ItemType } from "#/system/itemType.ts"

import { AttackWorkflowStep, useAttackWorkflow } from "./attackWorkflow.ts"

const iconByWeaponType: Record<WeaponType, RemixiconComponentType> = {
  [WeaponType.melee]: RiSwordLine,
  [WeaponType.firearm]: RiFireLine,
  [WeaponType.thrown]: RiFocusLine,
  [WeaponType.projectile]: RiFocusLine,
  [WeaponType.exotic]: RiFocusLine,
  [WeaponType.other]: RiFocusLine,
}

/** Landing view of the Attack Calculator: one row per equipped weapon. */
export const AttackWorkflowStepSelectWeapon: FC = () => {
  const workflow = useAttackWorkflow()

  const weapons = useEntitySelector(ItemSelectors.selectByFilter, {
    filter: (item) => !!(item.equipped && item.itemType === ItemType.weapon),
  }) as WeaponData[]

  const handleWeaponSelect = (weapon: WeaponData) => {
    workflow.setData((data) => {
      data.weaponId = weapon.id
      data.selectedSkill = weapon.skill
      data.selectedFiremode = null
      data.modifiers = {}
    })
    workflow.next(AttackWorkflowStep.SelectSkill)
  }

  return (
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
              <ListItemButton onClick={() => handleWeaponSelect(weapon)} sx={{ minHeight: 56 }}>
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
}
