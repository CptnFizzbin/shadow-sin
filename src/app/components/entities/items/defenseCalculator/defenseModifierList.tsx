import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { CounterInput } from "#/components/ui/form/inputs/counter/counterInput.tsx"

import type { DefenseModifierDatum } from "./defenseCalculatorData.ts"
import type { DefenseModifierSelection } from "./defenseModifierSelection.ts"

interface DefenseModifierListProps {
  modifiers: DefenseModifierDatum[]
  selection: DefenseModifierSelection
  onChange: (selection: DefenseModifierSelection) => void
  disabled?: boolean
}

const formatSigned = (value: number) => `${value >= 0 ? "+" : ""}${value}`

/** Controls for picking which Defense Modifiers Table rows apply to a Defense Test. */
export const DefenseModifierList: FC<DefenseModifierListProps> = ({ modifiers, selection, onChange, disabled }) => {
  const setToggle = (id: string, checked: boolean) =>
    onChange({ ...selection, toggles: { ...selection.toggles, [id]: checked } })

  return (
    <>
      {modifiers.map((modifier) => {
        if (modifier.kind === "toggle") {
          return (
            <FormControlLabel
              key={modifier.id}
              disabled={disabled}
              control={(
                <Checkbox
                  checked={selection.toggles[modifier.id] ?? false}
                  onChange={(event) => setToggle(modifier.id, event.target.checked)}
                  disabled={disabled}
                />
              )}
              label={`${modifier.label} (${formatSigned(modifier.value)})`}
            />
          )
        }

        if (modifier.kind === "stepper") {
          const enabled = selection.toggles[modifier.id] ?? false

          return (
            <Stack key={modifier.id} sx={{ gap: 0.5 }}>
              <FormControlLabel
                disabled={disabled}
                control={(
                  <Checkbox
                    checked={enabled}
                    onChange={(event) => {
                      const checked = event.target.checked
                      onChange({
                        ...selection,
                        toggles: { ...selection.toggles, [modifier.id]: checked },
                        steppers: checked && !selection.steppers[modifier.id]
                          ? { ...selection.steppers, [modifier.id]: modifier.min }
                          : selection.steppers,
                      })
                    }}
                    disabled={disabled}
                  />
                )}
                label={modifier.label}
              />

              {enabled && (
                <Stack direction="row" sx={{ alignItems: "center", pl: 4 }}>
                  <Typography variant="body2" sx={{ flex: 1 }}># of Attacks</Typography>
                  <CounterInput
                    value={selection.steppers[modifier.id] ?? modifier.min}
                    onChange={(value) => onChange({
                      ...selection,
                      steppers: { ...selection.steppers, [modifier.id]: value ?? modifier.min },
                    })}
                    min={modifier.min}
                    max={modifier.max}
                    disabled={disabled}
                    size="small"
                  />
                </Stack>
              )}
            </Stack>
          )
        }

        const chosenKey = selection.choices[modifier.id] ?? modifier.options[0].key

        return (
          <FormControl key={modifier.id} disabled={disabled}>
            <Typography variant="body2" color="text.secondary">{modifier.label}</Typography>
            <RadioGroup
              value={chosenKey}
              onChange={(event) => onChange({
                ...selection,
                choices: { ...selection.choices, [modifier.id]: event.target.value },
              })}
            >
              {modifier.options.map((option) => (
                <FormControlLabel
                  key={option.key}
                  value={option.key}
                  disabled={disabled}
                  control={<Radio disabled={disabled} />}
                  label={`${option.label}${option.value !== 0 ? ` (${formatSigned(option.value)})` : ""}`}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )
      })}
    </>
  )
}
