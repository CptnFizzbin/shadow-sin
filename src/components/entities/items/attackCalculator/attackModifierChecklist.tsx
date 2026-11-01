import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { CounterInput } from "#/components/ui/form/inputs/counter/counterInput.tsx"
import { Label } from "#/components/ui/text/label.tsx"

import type { WeaponAttackModifier } from "./weaponAttackCalculatorData.ts"

interface AttackModifierChecklistProps {
  modifiers: WeaponAttackModifier[]
  /** Dice applied per modifier, keyed by modifier label. A missing or `0` entry means not applied. */
  values: Record<string, number>
  onChange: (label: string, appliedValue: number) => void
}

const formatSigned = (value: number) => `${value >= 0 ? "+" : ""}${value}`

/** Checkbox (counter for per-unit rows, button group for choice rows) list of situational attack modifiers. */
export const AttackModifierChecklist: FC<AttackModifierChecklistProps> = ({ modifiers, values, onChange }) => (
  <Stack>
    {modifiers.map((modifier) => {
      const appliedValue = values[modifier.label] ?? 0

      switch (modifier.kind) {
        case "toggle":
          return (
            <FormControlLabel
              key={modifier.label}
              control={(
                <Checkbox
                  checked={appliedValue !== 0}
                  onChange={(event) => onChange(modifier.label, event.target.checked ? modifier.value : 0)}
                />
              )}
              label={`${modifier.label} (${formatSigned(modifier.value)})`}
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
                    onChange={(event) => onChange(modifier.label, event.target.checked ? modifier.perUnit : 0)}
                  />
                )}
                label={`${modifier.label} (${formatSigned(modifier.perUnit)} per)`}
              />

              <CounterInput
                value={selectedValue}
                onChange={(value) => onChange(modifier.label, (value ?? 0) * modifier.perUnit)}
                min={modifier.min}
                max={modifier.max}
                size="small"
              />
            </Stack>
          )
        }
        case "choice": {
          const selectedIndex = Math.max(0, modifier.options.findIndex((option) => option.value === appliedValue))

          return (
            <Stack key={modifier.label} sx={{ gap: 0.5, marginBottom: 1 }}>
              <Label label={modifier.label} />
              <ButtonGroup size="small" variant="outlined" fullWidth aria-label={modifier.label}>
                {modifier.options.map((option, index) => (
                  <Button
                    key={option.label}
                    variant={index === selectedIndex ? "contained" : "outlined"}
                    aria-pressed={index === selectedIndex}
                    onClick={() => onChange(modifier.label, option.value)}
                  >
                    <Box component="span">
                      {option.label}
                      {" "}
                      {/* Own line, so all bands wrap the same way on narrow screens. */}
                      <Box component="span" sx={{ display: "block" }}>({formatSigned(option.value)})</Box>
                    </Box>
                  </Button>
                ))}
              </ButtonGroup>
            </Stack>
          )
        }
      }
    })}
  </Stack>
)
