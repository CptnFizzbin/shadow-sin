import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { AvailablityInfo } from "#/lib/system/types/availablityInfo.ts"

interface AvailabilityFormState {
  availability?: AvailablityInfo
}

const defaultValues: AvailabilityFormState = {
  availability: {
    rating: 0,
    restricted: false,
    forbidden: false,
  },
}

export const AvailabilityFieldGroup = withFieldGroup({
  defaultValues: defaultValues,
  render: ({ group }) => {
    return (
      <Stack direction="row" gap={1}>
        <group.AppField name={"availability.rating"}>
          {(field) => (
            <field.NumberField
              label="Availability"
              size="small"
              sx={{ flex: 1 }}
            />
          )}
        </group.AppField>

        <group.Subscribe selector={(state) => state.values.availability}>
          {(availablity) => {
            const { restricted = false, forbidden = false } = availablity || {}

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
                    group.setFieldValue("availability.restricted", false)
                    group.setFieldValue("availability.forbidden", false)
                  }}
                >
                  —
                </ToggleButton>
                <ToggleButton
                  value="restricted"
                  sx={{ px: 1.5 }}
                  selected={restricted}
                  onClick={() => {
                    group.setFieldValue("availability.restricted", true)
                    group.setFieldValue("availability.forbidden", false)
                  }}
                >
                  R
                </ToggleButton>
                <ToggleButton
                  value="forbidden"
                  sx={{ px: 1.5 }}
                  selected={forbidden}
                  onClick={() => {
                    group.setFieldValue("availability.restricted", false)
                    group.setFieldValue("availability.forbidden", true)
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
