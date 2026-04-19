import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import type { AvailablityInfo } from "#/lib/system/availablityInfo.ts"

const defaultValues: AvailablityInfo = {
  rating: 0,
  restricted: false,
  forbidden: false,
}

export const AvailabilityFieldGroup = withFieldGroup({
  defaultValues: defaultValues,
  render: ({ group }) => {
    return (
      <Stack direction="row" sx={{ gap: 1 }}>
        <group.AppField name="rating">
          {(field) => (
            <field.NumberField
              label="Availability"
              size="small"
              sx={{ flex: 1 }}
            />
          )}
        </group.AppField>

        <group.Subscribe selector={(state) => state.values}>
          {({ restricted, forbidden }) => {
            return (
              <ToggleButtonGroup
                exclusive
                size="small"
                sx={{ height: 40, alignSelf: "center" }}
              >
                <ToggleButton
                  value="none"
                  sx={{ px: 1.5 }}
                  selected={!restricted && !forbidden}
                  onClick={() => {
                    group.setFieldValue("restricted", false)
                    group.setFieldValue("forbidden", false)
                  }}
                >
                  —
                </ToggleButton>
                <ToggleButton
                  value="restricted"
                  sx={{ px: 1.5 }}
                  selected={restricted}
                  onClick={() => {
                    group.setFieldValue("restricted", true)
                    group.setFieldValue("forbidden", false)
                  }}
                >
                  R
                </ToggleButton>
                <ToggleButton
                  value="forbidden"
                  sx={{ px: 1.5 }}
                  selected={forbidden}
                  onClick={() => {
                    group.setFieldValue("restricted", false)
                    group.setFieldValue("forbidden", true)
                  }}
                >
                  F
                </ToggleButton>
              </ToggleButtonGroup>
            )
          }}
        </group.Subscribe>
      </Stack>
    )
  },
})
