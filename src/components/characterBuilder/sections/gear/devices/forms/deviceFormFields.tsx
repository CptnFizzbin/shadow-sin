import Stack from "@mui/material/Stack"
import { z } from "zod"

import { deviceFormOpts } from "#/components/characterBuilder/sections/gear/devices/forms/useDeviceForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

const positiveInt = z.number().int().min(0)

export const DeviceFormFields = withFieldGroup({
  ...deviceFormOpts,
  render: ({ group }) => {
    return (
      <Stack sx={{ gap: 1 }}>
        <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
          <group.AppField
            name="deviceRating"
            validators={{ onChange: positiveInt }}
          >
            {(field) => (
              <field.NumberField
                label="Device Rating"
                size="small"
                sx={{ flex: 1, minWidth: 100 }}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
              />
            )}
          </group.AppField>
        </Stack>

        <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
          <group.AppField name="response" validators={{ onChange: positiveInt }}>
            {(field) => (
              <field.NumberField
                label="Response"
                size="small"
                sx={{ flex: 1, minWidth: 80 }}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
              />
            )}
          </group.AppField>

          <group.AppField name="signal" validators={{ onChange: positiveInt }}>
            {(field) => (
              <field.NumberField
                label="Signal"
                size="small"
                sx={{ flex: 1, minWidth: 80 }}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
              />
            )}
          </group.AppField>

          <group.AppField name="system" validators={{ onChange: positiveInt }}>
            {(field) => (
              <field.NumberField
                label="System"
                size="small"
                sx={{ flex: 1, minWidth: 80 }}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
              />
            )}
          </group.AppField>

          <group.AppField name="firewall" validators={{ onChange: positiveInt }}>
            {(field) => (
              <field.NumberField
                label="Firewall"
                size="small"
                sx={{ flex: 1, minWidth: 80 }}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
              />
            )}
          </group.AppField>
        </Stack>

        <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
          <group.AppField name="dataProcessing" validators={{ onChange: positiveInt }}>
            {(field) => (
              <field.NumberField
                label="Data Processing"
                size="small"
                sx={{ flex: 1, minWidth: 120 }}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
              />
            )}
          </group.AppField>

          <group.AppField name="programSlots" validators={{ onChange: positiveInt }}>
            {(field) => (
              <field.NumberField
                label="Program Slots"
                size="small"
                sx={{ flex: 1, minWidth: 120 }}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
              />
            )}
          </group.AppField>
        </Stack>
      </Stack>
    )
  },
})
