import Stack from "@mui/material/Stack"

import { Label } from "#/components/ui/text/label.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

import { deviceFormOpts } from "./useDeviceForm.tsx"

const deviceTypeOptions = [
  { label: "Commlink", value: "commlink" },
  { label: "Other", value: "other" },
]

export const DeviceFormFields = withFieldGroup({
  ...deviceFormOpts,
  render: ({ group }) => {
    return (
      <Stack sx={{ gap: 1 }}>
        <Label label="Device Properties" />

        <group.AppField name="deviceType">
          {(field) => (
            <field.SelectField
              label="Device Type"
              size="small"
              fullWidth
              options={deviceTypeOptions}
            />
          )}
        </group.AppField>

        <group.Subscribe selector={(state) => state.values.deviceType}>
          {(deviceType) =>
            deviceType === "other"
              ? (
                  <group.AppField name="customDeviceType">
                    {(field) => (
                      <field.TextField label="Custom Device Type" size="small" fullWidth />
                    )}
                  </group.AppField>
                )
              : (
                  <Stack direction="row" sx={{ gap: 1 }}>
                    <group.AppField name="deviceModel">
                      {(field) => (
                        <field.TextField label="Model" size="small" sx={{ flex: 1 }} />
                      )}
                    </group.AppField>

                    <group.AppField name="deviceOS">
                      {(field) => (
                        <field.TextField label="OS" size="small" sx={{ flex: 1 }} />
                      )}
                    </group.AppField>
                  </Stack>
                )}
        </group.Subscribe>

        <Label label="Matrix Properties" />

        <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
          <group.AppField name="deviceRating">
            {(field) => (
              <field.CounterField label="Device Rating" min={0} max={99} />
            )}
          </group.AppField>

          <group.AppField name="response">
            {(field) => (
              <field.CounterField label="Response" min={0} max={99} />
            )}
          </group.AppField>

          <group.AppField name="signal">
            {(field) => (
              <field.CounterField label="Signal" min={0} max={99} />
            )}
          </group.AppField>

          <group.AppField name="system">
            {(field) => (
              <field.CounterField label="System" min={0} max={99} />
            )}
          </group.AppField>

          <group.AppField name="firewall">
            {(field) => (
              <field.CounterField label="Firewall" min={0} max={99} />
            )}
          </group.AppField>

          <group.AppField name="dataProcessing">
            {(field) => (
              <field.CounterField label="Data Processing" min={0} max={99} />
            )}
          </group.AppField>

          <group.AppField name="programSlots">
            {(field) => (
              <field.CounterField label="Program Slots" min={0} max={99} />
            )}
          </group.AppField>
        </Stack>
      </Stack>
    )
  },
})
