import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { DamageSelectors } from "#/state/runner/damage/damage.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { AttackModifierChecklist } from "./attackModifierChecklist.tsx"
import { useAttackWorkflow } from "./attackWorkflow.ts"
import type { WeaponAttackModifier } from "./weaponAttackCalculatorData.ts"

interface WeaponAttackModifierListProps {
  modifiers: WeaponAttackModifier[]
}

/**
 * The wound modifier plus one weapon type's own situational modifier table — shared rendering for
 * `MeleeModifiersStep`/`RangedModifiersStep`, each of which hardcodes which `modifiers` table it
 * passes in.
 */
export const WeaponAttackModifierList: FC<WeaponAttackModifierListProps> = ({ modifiers }) => {
  const workflow = useAttackWorkflow()

  const woundMod = useRunnerSelector(DamageSelectors.selectWoundMod)

  return (
    <Stack>
      {woundMod >= 1 && (
        <FormControlLabel
          control={<Checkbox checked disabled />}
          label={`Wounded (-${woundMod})`}
        />
      )}

      <AttackModifierChecklist
        modifiers={modifiers}
        values={workflow.data.modifiers}
        onChange={(label, appliedValue) => workflow.setData((data) => {
          data.modifiers[label] = appliedValue
        })}
      />
    </Stack>
  )
}
