import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { CounterInput } from "#/components/ui/counter/counterInput.tsx"

import type { AttackModifierDefinition } from "./attackModifierData.ts"
import { modifierContribution } from "./attackModifierData.ts"

interface ModifierListProps {
  definitions: AttackModifierDefinition[]
  values: Record<string, number>
  onChange: (key: string, points: number) => void
}

const formatSigned = (value: number) => value >= 0 ? `+${value}` : `${value}`

export const ModifierList: FC<ModifierListProps> = ({ definitions, values, onChange }) => (
  <Stack sx={{ gap: 1 }}>
    {definitions.map((definition) => {
      const points = values[definition.key] ?? 0
      const contribution = modifierContribution(definition, points)

      return (
        <Stack key={definition.key} sx={{ gap: 1 }}>
          {definition.groupLabel && (
            <>
              <Divider />
              <Typography variant="overline" color="text.secondary">
                {definition.groupLabel}
              </Typography>
            </>
          )}

          {definition.kind === "note" && (
            <Stack sx={{ gap: 0.25 }}>
              <Typography variant="body2">{definition.label}</Typography>
              {definition.hint && (
                <Typography variant="caption" color="text.secondary">{definition.hint}</Typography>
              )}
            </Stack>
          )}

          {definition.kind === "toggle" && (
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
              <FormControlLabel
                sx={{ flex: 1, marginRight: 0 }}
                control={(
                  <Switch
                    checked={points !== 0}
                    onChange={(event) => onChange(definition.key, event.target.checked ? 1 : 0)}
                  />
                )}
                label={definition.label}
              />
              {contribution !== 0 && (
                <Typography
                  color={contribution > 0 ? "success.main" : "error.main"}
                  sx={{ fontWeight: "bold" }}
                >
                  {formatSigned(contribution)}
                </Typography>
              )}
            </Stack>
          )}

          {definition.kind === "stepper" && (
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}>
              <Stack sx={{ gap: 0.25 }}>
                <Typography variant="body2">{definition.label}</Typography>
                {definition.hint && (
                  <Typography variant="caption" color="text.secondary">{definition.hint}</Typography>
                )}
              </Stack>
              <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                {contribution !== 0 && (
                  <Typography
                    color={contribution > 0 ? "success.main" : "error.main"}
                    sx={{ fontWeight: "bold" }}
                  >
                    {formatSigned(contribution)}
                  </Typography>
                )}
                <CounterInput
                  value={points}
                  onChange={(newValue) => onChange(definition.key, newValue ?? 0)}
                  min={definition.min}
                  max={definition.max}
                  size="small"
                />
              </Stack>
            </Stack>
          )}
        </Stack>
      )
    })}
  </Stack>
)
