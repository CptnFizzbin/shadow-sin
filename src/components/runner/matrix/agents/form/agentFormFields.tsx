import Stack from "@mui/material/Stack"
import type { FC } from "react"

import type { AgentForm } from "#/lib/hooks/runner/matrix/agents/form/useAgentForm.ts"

interface AgentFormFieldsProps {
  form: AgentForm
}

export const AgentFormFields: FC<AgentFormFieldsProps> = ({ form }) => {
  return (
    <Stack sx={{ gap: 2 }}>
      <form.AppField name="name">
        {(field) => <field.TextField label="Name" placeholder="e.g. Watchdog" />}
      </form.AppField>

      <form.AppField name="rating">
        {(field) => (
          <field.NumberField
            label="Rating"
            slotProps={{ htmlInput: { min: 1, max: 6 } }}
          />
        )}
      </form.AppField>

      <form.AppField name="notes">
        {(field) => <field.TextField label="Notes" multiline rows={3} />}
      </form.AppField>
    </Stack>
  )
}
