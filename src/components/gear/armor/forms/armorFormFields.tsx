import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { z } from "zod"

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
            <group.AppField
              name="ballistic"
              validators={{
                onChange: z
                  .number("Ballistic is required")
                  .int("Ballistic must be a whole number")
                  .min(0, "Ballistic must be 0 or more"),
              }}
            >
              {(field) => (
                <field.NumberField
                  label="Ballistic"
                  size="small"
                  sx={{ flex: 1 }}
                  slotProps={{ htmlInput: { min: 0, step: 1 } }}
                />
              )}
            </group.AppField>

            <group.AppField
              name="impact"
              validators={{
                onChange: z
                  .number("Impact is required")
                  .int("Impact must be a whole number")
                  .min(0, "Impact must be 0 or more"),
              }}
            >
              {(field) => (
                <field.NumberField
                  label="Impact"
                  size="small"
                  sx={{ flex: 1 }}
                  slotProps={{ htmlInput: { min: 0, step: 1 } }}
                />
              )}
            </group.AppField>
          </Stack>
        </Stack>
      </Paper>
    )
  },
})
