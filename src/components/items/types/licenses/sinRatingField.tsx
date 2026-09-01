import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import type { FC } from "react"

import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import type { SinForm } from "#/hooks/items/types/licenses/forms/useSinForm.tsx"

interface SinRatingFieldProps {
  form: SinForm
}

/**
 * Rating control for a SIN — a fake SIN carries a numeric rating (its forgery quality), while a
 * Real SIN has no rating at all. The [Real | Fake] toggle swaps the form's `isReal` flag; the
 * counter only renders (and only matters) while `isReal` is `false`.
 */
export const SinRatingField: FC<SinRatingFieldProps> = ({ form }) => {
  return (
    <form.AppField name="isReal">
      {(isRealField) => (
        <Stack direction="row" sx={{ gap: 1 }}>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={isRealField.state.value ? "real" : "fake"}
            onChange={(_, value) => {
              if (!value) return
              isRealField.handleChange(value === "real")
            }}
          >
            <ToggleButton value="real">Real</ToggleButton>
            <ToggleButton value="fake">Fake</ToggleButton>
          </ToggleButtonGroup>

          {!isRealField.state.value && (
            <form.AppField name="rating">
              {(ratingField) => (
                <CounterInput
                  label="Rating"
                  size="small"
                  min={1}
                  max={6}
                  value={ratingField.state.value ?? null}
                  onChange={(newValue) => ratingField.handleChange(newValue ?? 1)}
                />
              )}
            </form.AppField>
          )}
        </Stack>
      )}
    </form.AppField>
  )
}
