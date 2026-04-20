import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import type { FC } from "react"

import { useFieldContext } from "#/integrations/tanstackForm/fieldContext.ts"

interface CheckboxFieldProps {
  label: string
}

export const CheckboxField: FC<CheckboxFieldProps> = ({ label }) => {
  const field = useFieldContext<boolean>()

  return (
    <FormControlLabel
      control={(
        <Checkbox
          checked={field.state.value ?? false}
          onChange={(e) => field.handleChange(e.target.checked)}
        />
      )}
      label={label}
    />
  )
}
