import Stack from "@mui/material/Stack"
import { z } from "zod"

import {
  gearItemFieldMap,
  gearItemFormOpts,
} from "#/components/Character/Form/Gear/Generic/Forms/UseGearItemForm.tsx"
import { AvailabilityFieldGroup } from "#/components/Character/Form/General/Form/AvailabilityFieldGroup.tsx"
import { SourceFieldGroup } from "#/components/Character/Form/General/Form/SourceFieldGroup.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"

export const GearItemFormFields = withFieldGroup({
  ...gearItemFormOpts,
  render: ({ group }) => {
    return (
      <Stack gap={1}>
        <group.AppField
          name="name"
          validators={{ onChange: z.string().min(1, "Name is required") }}
        >
          {(field) => (
            <field.TextField label="Name" fullWidth size="small" autoFocus />
          )}
        </group.AppField>

        <group.AppField
          name="cost"
          validators={{
            onChange: z
              .number("Cost is required")
              .min(0, "Cost must be 0 or more"),
          }}
        >
          {(field) => (
            <field.NumberField label="Cost (¥)" fullWidth size="small" />
          )}
        </group.AppField>

        <AvailabilityFieldGroup form={group} fields={gearItemFieldMap} />
        <SourceFieldGroup form={group} fields={gearItemFieldMap} />

        <group.AppField name="notes">
          {(field) => (
            <field.TextField
              label="Notes"
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
