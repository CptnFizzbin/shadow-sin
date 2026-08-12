import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import type { FC } from "react"

import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import type { AnyItemForm, ItemForm } from "#/lib/hooks/items/forms/useItemForm.tsx"

interface SinRatingFieldProps {
  form: AnyItemForm
}

/**
 * Rating control for a SIN — a fake SIN carries a numeric rating (its forgery quality), while a
 * Real SIN has no rating at all. The "Real SIN" switch replaces the numeric input with the
 * `"real"` sentinel (`SinData["rating"]`) instead of a counter value.
 */
export const SinRatingField: FC<SinRatingFieldProps> = ({ form: formArg }) => {
  const form = formArg as ItemForm

  return (
    <form.AppField name="rating">
      {(field) => {
        const isReal = field.state.value === "real"

        return (
          <Stack direction="row" sx={{ alignItems: "center" }}>
            {!isReal && (
              <CounterInput
                label="Rating"
                size="small"
                min={1}
                max={6}
                value={typeof field.state.value === "number" ? field.state.value : 1}
                onChange={(newValue) => field.handleChange(newValue ?? 1)}
              />
            )}

            <FormControlLabel
              sx={{ ml: isReal ? 0 : "auto" }}
              control={(
                <Switch
                  checked={isReal}
                  onChange={(e) => field.handleChange(e.target.checked ? "real" : 1)}
                />
              )}
              label="Real SIN"
            />
          </Stack>
        )
      }}
    </form.AppField>
  )
}
