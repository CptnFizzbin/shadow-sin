import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"

import {
  armorFormOpts,
} from "#/components/gear/armor/forms/useArmorForm.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

export const ArmorFormFields = withFieldGroup({
  ...armorFormOpts,
  render: ({ group }) => {
    return (
      <Paper sx={{ padding: 1 }}>
        <Stack>
          <Label label="Armor Ratings" />

          <Stack direction="row" sx={{ gap: 1 }}>
            <group.AppField name="ballistic">
              {(field) => <field.CounterField label="Ballistic" min={0} max={20} />}
            </group.AppField>

            <group.AppField name="impact">
              {(field) => <field.CounterField label="Impact" min={0} max={20} />}
            </group.AppField>
          </Stack>
        </Stack>
      </Paper>
    )
  },
})
