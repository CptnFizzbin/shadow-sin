import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import type { RemixiconComponentType } from "@remixicon/react"
import { RiArrowRightSLine, RiAwardLine, RiEqualizerLine, RiSwordLine, RiTargetLine } from "@remixicon/react"
import type { FC } from "react"

import type { SkillKey } from "#/system/skills/skillKey.ts"

import type { WeaponAttackCalculatorStep } from "./weaponAttackCalculatorTypes.ts"

interface WeaponAttackHubListProps {
  weaponName: string
  skill: SkillKey
  skillRating: number
  attackModifierTotal: number
  defenseModifierTotal: number
  poolTotal: number
  onSelectStep: (step: WeaponAttackCalculatorStep) => void
}

const formatSigned = (value: number) => value >= 0 ? `+${value}` : `${value}`

export const WeaponAttackHubList: FC<WeaponAttackHubListProps> = ({
  weaponName,
  skill,
  skillRating,
  attackModifierTotal,
  defenseModifierTotal,
  poolTotal,
  onSelectStep,
}) => {
  const rows: { step: WeaponAttackCalculatorStep, label: string, secondary: string, Icon: RemixiconComponentType }[] = [
    { step: "weapon", label: "Weapon", secondary: weaponName, Icon: RiSwordLine },
    { step: "skill", label: "Skill", secondary: `${skill} (${skillRating})`, Icon: RiAwardLine },
    {
      step: "modifiers",
      label: "Modifiers",
      secondary: `Attack ${formatSigned(attackModifierTotal)} · Defense ${formatSigned(defenseModifierTotal)}`,
      Icon: RiEqualizerLine,
    },
    { step: "result", label: "Result", secondary: `Attack pool: ${poolTotal}`, Icon: RiTargetLine },
  ]

  return (
    <Paper>
      <List disablePadding>
        {rows.map(({ step, label, secondary, Icon }, index) => (
          <ListItem
            key={step}
            disablePadding
            divider={index < rows.length - 1}
            secondaryAction={(
              <RiArrowRightSLine size={18} style={{ color: "var(--mui-palette-text-secondary)" }} />
            )}
          >
            <ListItemButton onClick={() => onSelectStep(step)} sx={{ minHeight: 56 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Icon size={20} />
              </ListItemIcon>
              <ListItemText primary={label} secondary={secondary} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
