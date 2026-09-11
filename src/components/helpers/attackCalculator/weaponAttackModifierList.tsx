import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import { DamageSelectors } from "#/stores/runner/damage/damageSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

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

      {modifiers.map((modifier) => {
        const appliedValue = workflow.data.modifiers[modifier.label] ?? 0

        switch (modifier.kind) {
          case "toggle":
            return (
              <FormControlLabel
                key={modifier.label}
                control={(
                  <Checkbox
                    checked={appliedValue !== 0}
                    onChange={(event) => {
                      return workflow.setData((data) => {
                        data.modifiers[modifier.label] = event.target.checked ? modifier.value : 0
                      })
                    }}
                  />
                )}
                label={`${modifier.label} (${modifier.value >= 0 ? "+" : ""}${modifier.value})`}
              />
            )
          case "stepper": {
            const selectedValue = Math.floor(appliedValue / modifier.perUnit)

            return (
              <Stack key={modifier.label} direction="row" sx={{ alignItems: "center" }}>
                <FormControlLabel
                  sx={{ flexGrow: 1 }}
                  control={(
                    <Checkbox
                      checked={selectedValue !== 0}
                      onChange={(event) => {
                        return workflow.setData((data) => {
                          data.modifiers[modifier.label] = event.target.checked ? modifier.perUnit : 0
                        })
                      }}
                    />
                  )}
                  label={`${modifier.label} (${modifier.perUnit >= 0 ? "+" : ""}${modifier.perUnit} per)`}
                />

                <CounterInput
                  value={selectedValue}
                  onChange={(value) => {
                    return workflow.setData((data) => {
                      data.modifiers[modifier.label] = (value ?? 0) * modifier.perUnit
                    })
                  }}
                  min={modifier.min}
                  max={modifier.max}
                  size="small"
                />
              </Stack>
            )
          }
        }
      })}
    </Stack>
  )
}
