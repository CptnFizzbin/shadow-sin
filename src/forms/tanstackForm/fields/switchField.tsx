import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import type { FC } from "react"

import { useFieldContext } from "#/integrations/tanstackForm/fieldContext.ts"

interface SwitchFieldProps {
  label: string
}

export const SwitchField: FC<SwitchFieldProps> = ({ label }) => {
  const field = useFieldContext<boolean>()

  return (
    <FormControlLabel
      control={(
        <Switch
          checked={field.state.value ?? false}
          onChange={(e) => field.handleChange(e.target.checked)}
        />
      )}
      label={label}
    />
  )
}
