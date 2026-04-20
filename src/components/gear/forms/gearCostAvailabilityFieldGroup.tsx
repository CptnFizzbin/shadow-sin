import Stack from "@mui/material/Stack"
import { z } from "zod"

import { AvailabilityFieldGroup } from "#/components/availablity/availabilityFieldGroup.tsx"
import { itemFormOpts } from "#/components/gear/forms/useItemForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

export const GearCostAvailabilityFieldGroup = withFieldGroup({
  ...itemFormOpts,
  render: ({ group }) => {
    return (
      <Stack direction="row" sx={{ gap: 1, alignItems: "flex-start" }}>
        <group.AppField
          name="cost"
          validators={{
            onChange: z.number("Cost is required").min(0, "Cost must be 0 or more"),
          }}
        >
          {(field) => (
            <field.NuyenField size="small" sx={{ flex: 1 }} />
          )}
        </group.AppField>

        <AvailabilityFieldGroup form={group} fields="availability" />
      </Stack>
    )
  },
})
