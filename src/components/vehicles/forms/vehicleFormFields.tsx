import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import { z } from "zod"

import { AvailabilityFieldGroup } from "#/components/availablity/availabilityFieldGroup.tsx"
import { SourceFieldGroup } from "#/components/sources/sourceFieldGroup.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import {
  vehicleFormOpts,
} from "#/components/vehicles/forms/useVehicleForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { VehicleCategory } from "#/lib/system/gear/vehicleData.ts"

const accelPattern = /^\d+\/\d+$/

export const VehicleFormFields = withFieldGroup({
  ...vehicleFormOpts,
  render: ({ group }) => {
    return (
      <Stack sx={{ gap: 1 }}>
        <group.Subscribe selector={({ values }) => values.vehicleCategory}>
          {(vehicleCategory) => (
            <ToggleButtonGroup
              exclusive
              size="small"
              value={vehicleCategory}
              onChange={(_, value: VehicleCategory | null) => {
                if (value !== null) {
                  group.setFieldValue("vehicleCategory", value)
                }
              }}
              fullWidth
            >
              <ToggleButton value={VehicleCategory.vehicle}>Vehicle</ToggleButton>
              <ToggleButton value={VehicleCategory.drone}>Drone</ToggleButton>
            </ToggleButtonGroup>
          )}
        </group.Subscribe>

        <group.AppField
          name="name"
          validators={{ onChange: z.string().min(1, "Name is required") }}
        >
          {(field) => (
            <field.TextField label="Name" fullWidth size="small" autoFocus />
          )}
        </group.AppField>

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
                    .int("Handling must be a whole number")
                    .min(0, "Handling must be 0 or more"),
                }}
              >
                {(field) => (
                  <field.NumberField
                    label="Handling"
                    size="small"
                    sx={{ flex: 1, minWidth: 90 }}
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
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

        <group.AppField
          name="cost"
          validators={{
            onChange: z.number("Cost is required").min(0, "Cost must be 0 or more"),
          }}
        >
          {(field) => (
            <field.NumberField label="Cost (¥)" fullWidth size="small" />
          )}
        </group.AppField>

        <AvailabilityFieldGroup form={group} fields="availability" />
        <SourceFieldGroup form={group} fields={{ source: "source" }} />

        <group.AppField name="description">
          {(field) => (
            <field.TextField
              label="Description / Notes"
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          )}
        </group.AppField>
      </Stack>
    )
  },
})
