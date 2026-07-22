import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"

import { defenseModifiers, meleeAttackModifiers } from "./attackModifierData.ts"
import { ModifierList } from "./modifierList.tsx"

interface ModifiersSectionProps {
  isMelee: boolean
  attackValues: Record<string, number>
  onAttackChange: (key: string, points: number) => void
  defenseValues: Record<string, number>
  onDefenseChange: (key: string, points: number) => void
}

export const ModifiersSection: FC<ModifiersSectionProps> = ({
  isMelee,
  attackValues,
  onAttackChange,
  defenseValues,
  onDefenseChange,
}) => (
  <Stack sx={{ gap: 2 }}>
    <Stack sx={{ gap: 1 }}>
      <Label label="Attack Modifiers" variant="outlined" />
      {isMelee
        ? (
            <ModifierList definitions={meleeAttackModifiers} values={attackValues} onChange={onAttackChange} />
          )
        : (
            <Typography variant="body2" color="text.secondary">
              The Melee Modifier Table only applies to melee attacks. This weapon's attack pool isn't
              adjusted here.
            </Typography>
          )}
    </Stack>

    <Divider />

    <Stack sx={{ gap: 1 }}>
      <Label label="Defense Modifiers" variant="outlined" />
      <Typography variant="body2" color="text.secondary">
        Reference for the defender's roll — not applied to your Attack Test.
      </Typography>
      <ModifierList definitions={defenseModifiers} values={defenseValues} onChange={onDefenseChange} />
    </Stack>
  </Stack>
)
