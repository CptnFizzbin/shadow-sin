import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormLabel from "@mui/material/FormLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { CounterInput } from "#/components/ui/form/inputs/counter/counterInput.tsx"

import type { WeaponAttackModifier } from "./weaponAttackCalculatorData.ts"

interface AttackModifierChecklistProps {
  modifiers: WeaponAttackModifier[]
  /** Dice applied per modifier, keyed by modifier label. A missing or `0` entry means not applied. */
  values: Record<string, number>
  onChange: (label: string, appliedValue: number) => void
}

const formatSigned = (value: number) => `${value >= 0 ? "+" : ""}${value}`

/** Checkbox (counter for per-unit rows, radio group for choice rows) list of situational attack modifiers. */
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
            <FormControl key={modifier.label}>
              <FormLabel>{modifier.label}</FormLabel>
              <RadioGroup
                row
                aria-label={modifier.label}
                value={String(selectedIndex)}
                onChange={(event) => onChange(modifier.label, modifier.options[Number(event.target.value)].value)}
              >
                {modifier.options.map((option, index) => (
                  <FormControlLabel
                    key={option.label}
                    value={String(index)}
                    control={<Radio />}
                    label={`${option.label} (${formatSigned(option.value)})`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )
        }
      }
    })}
  </Stack>
)
