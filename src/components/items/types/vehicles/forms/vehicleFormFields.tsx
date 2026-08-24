import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { z } from "zod"

import { Label } from "#/components/ui/text/label.tsx"
import { vehicleFormOpts } from "#/hooks/items/types/vehicles/forms/useVehicleForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

const accelPattern = /^\d+\/\d+$/

export const VehicleFormFields = withFieldGroup({
  ...vehicleFormOpts,
  render: ({ group }) => {
    return (
      <Stack>
        <group.AppField name="vehicleType">
          {(field) => (
            <field.TextField label="Vehicle Type" fullWidth size="small" placeholder="e.g. bike, car, drone" />
          )}
        </group.AppField>

        <group.AppField name="model">
          {(field) => (
            <field.TextField label="Model" fullWidth size="small" />
          )}
        </group.AppField>

        <Paper sx={{ padding: 1 }}>
          <Stack>
            <Label label="Vehicle Stats" />

            <Stack direction="row" sx={{ flexWrap: "wrap" }}>
              <group.AppField name="handling">
                {(field) => <field.CounterField label="Handling" min={0} max={20} />}
              </group.AppField>

              <group.AppField
                name="accel"
                validators={{
                  onChange: z
                    .string()
                    .regex(accelPattern, "Format must be N/N (e.g. 10/25)"),
                }}
              >
                {(field) => (
                  <field.TextField
                    label="Accel"
                    size="small"
                    sx={{ flex: 1, minWidth: 90 }}
                    placeholder="e.g. 10/25"
                  />
                )}
              </group.AppField>

              <group.AppField name="speed">
                {(field) => <field.CounterField label="Speed" min={0} max={999} />}
              </group.AppField>
            </Stack>

            <Stack direction="row" sx={{ flexWrap: "wrap" }}>
              <group.AppField name="pilot">
                {(field) => <field.CounterField label="Pilot" min={0} max={12} />}
              </group.AppField>

              <group.AppField name="body">
                {(field) => <field.CounterField label="Body" min={0} max={20} />}
              </group.AppField>

              <group.AppField name="armor">
                {(field) => <field.CounterField label="Armor" min={0} max={20} />}
              </group.AppField>

              <group.AppField name="sensor">
                {(field) => <field.CounterField label="Sensor" min={0} max={12} />}
              </group.AppField>

              <group.AppField name="seats">
                {(field) => <field.CounterField label="Seats" min={0} max={20} />}
              </group.AppField>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    )
  },
})
