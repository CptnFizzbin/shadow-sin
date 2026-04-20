import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { z } from "zod"

import { Label } from "#/components/ui/text/label.tsx"
import { vehicleFormOpts } from "#/components/vehicles/forms/useVehicleForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

const accelPattern = /^\d+\/\d+$/

export const VehicleFormFields = withFieldGroup({
  ...vehicleFormOpts,
  render: ({ group }) => {
    return (
      <Stack sx={{ gap: 1 }}>
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
          <Stack sx={{ gap: 1 }}>
            <Label label="Vehicle Stats" />

            <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
              <group.AppField
                name="handling"
                validators={{
                  onChange: z
                    .number("Handling is required")
                    .int("Handling must be a whole number"),
                }}
              >
                {(field) => (
                  <field.NumberField
                    label="Handling"
                    size="small"
                    sx={{ flex: 1, minWidth: 90 }}
                    slotProps={{ htmlInput: { step: 1 } }}
                  />
                )}
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

              <group.AppField
                name="speed"
                validators={{
                  onChange: z
                    .number("Speed is required")
                    .int("Speed must be a whole number")
                    .min(0, "Speed must be 0 or more"),
                }}
              >
                {(field) => (
                  <field.NumberField
                    label="Speed"
                    size="small"
                    sx={{ flex: 1, minWidth: 90 }}
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
                  />
                )}
              </group.AppField>
            </Stack>

            <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
              <group.AppField
                name="pilot"
                validators={{
                  onChange: z
                    .number("Pilot is required")
                    .int("Pilot must be a whole number")
                    .min(0, "Pilot must be 0 or more"),
                }}
              >
                {(field) => (
                  <field.NumberField
                    label="Pilot"
                    size="small"
                    sx={{ flex: 1, minWidth: 90 }}
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
                  />
                )}
              </group.AppField>

              <group.AppField
                name="body"
                validators={{
                  onChange: z
                    .number("Body is required")
                    .int("Body must be a whole number")
                    .min(0, "Body must be 0 or more"),
                }}
              >
                {(field) => (
                  <field.NumberField
                    label="Body"
                    size="small"
                    sx={{ flex: 1, minWidth: 90 }}
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
                  />
                )}
              </group.AppField>

              <group.AppField
                name="armor"
                validators={{
                  onChange: z
                    .number("Armor is required")
                    .int("Armor must be a whole number")
                    .min(0, "Armor must be 0 or more"),
                }}
              >
                {(field) => (
                  <field.NumberField
                    label="Armor"
                    size="small"
                    sx={{ flex: 1, minWidth: 90 }}
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
                  />
                )}
              </group.AppField>

              <group.AppField
                name="sensor"
                validators={{
                  onChange: z
                    .number("Sensor is required")
                    .int("Sensor must be a whole number")
                    .min(0, "Sensor must be 0 or more"),
                }}
              >
                {(field) => (
                  <field.NumberField
                    label="Sensor"
                    size="small"
                    sx={{ flex: 1, minWidth: 90 }}
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
                  />
                )}
              </group.AppField>

              <group.AppField
                name="seats"
                validators={{
                  onChange: z
                    .number()
                    .int("Seats must be a whole number")
                    .min(0, "Seats must be 0 or more")
                    .optional(),
                }}
              >
                {(field) => (
                  <field.NumberField
                    label="Seats"
                    size="small"
                    sx={{ flex: 1, minWidth: 90 }}
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
                  />
                )}
              </group.AppField>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    )
  },
})
