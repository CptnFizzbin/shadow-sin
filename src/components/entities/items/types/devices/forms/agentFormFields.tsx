import Stack from "@mui/material/Stack"

import { agentFormOpts } from "#/hooks/items/types/devices/forms/useAgentForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

const ATTRIBUTE_MIN = 0
const ATTRIBUTE_MAX = 99

export const AgentFormFields = withFieldGroup({
  ...agentFormOpts,
  render: ({ group }) => (
    <Stack direction="row" sx={{ flexWrap: "wrap" }}>
      <group.AppField name="attributes.system">
        {(field) => (
          <field.CounterField label="System" size="small" min={ATTRIBUTE_MIN} max={ATTRIBUTE_MAX} />
        )}
      </group.AppField>

      <group.AppField name="attributes.firewall">
        {(field) => (
          <field.CounterField label="Firewall" size="small" min={ATTRIBUTE_MIN} max={ATTRIBUTE_MAX} />
        )}
      </group.AppField>
    </Stack>
  ),
})
