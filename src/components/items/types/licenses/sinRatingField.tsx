import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import type { FC } from "react"

import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import type { AnyItemForm, ItemForm } from "#/hooks/items/forms/useItemForm.tsx"

interface SinRatingFieldProps {
  form: AnyItemForm
}

/**
 * Rating control for a SIN — a fake SIN carries a numeric rating (its forgery quality), while a
 * Real SIN has no rating at all. The [Real | Fake] toggle swaps between the `"real"` sentinel
 * (`SinData["rating"]`) and a numeric counter value.
 */
export const SinRatingField: FC<SinRatingFieldProps> = ({ form: formArg }) => {
  const form = formArg as ItemForm

  return (
    <form.AppField name="rating">
      {(field) => {
        const isReal = field.state.value === "real"
        const numericRating = typeof field.state.value === "number" ? field.state.value : 1

        return (
          <Stack direction="row" sx={{ gap: 1 }}>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={isReal ? "real" : "fake"}
              onChange={(_, value) => {
                if (!value) return
                field.handleChange(value === "real" ? "real" : numericRating)
              }}
            >
              <ToggleButton value="real">Real</ToggleButton>
              <ToggleButton value="fake">Fake</ToggleButton>
            </ToggleButtonGroup>

            {!isReal && (
              <CounterInput
                label="Rating"
                size="small"
                min={1}
                max={6}
                value={numericRating}
                onChange={(newValue) => field.handleChange(newValue ?? 1)}
              />
            )}
          </Stack>
        )
      }}
    </form.AppField>
  )
}
