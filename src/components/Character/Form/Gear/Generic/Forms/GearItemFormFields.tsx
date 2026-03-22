import Stack from "@mui/material/Stack"
import { z } from "zod"

import type { AvailabilityRestriction } from "#/components/Character/Form/Gear/Generic/Forms/AvailabilityFormFields.tsx"
import { AvailabilityFormFields } from "#/components/Character/Form/Gear/Generic/Forms/AvailabilityFormFields.tsx"
import { SourceFormFields } from "#/components/Character/Form/Gear/Generic/Forms/SourceFormFields.tsx"
import { gearItemFormOpts } from "#/components/Character/Form/Gear/Generic/Forms/UseGearItemForm.tsx"
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

        <group.Subscribe selector={(state) => state.values}>
          {(values) => (
            <AvailabilityFormFields
              availabilityRating={values.availabilityRating}
              restriction={values.restriction as AvailabilityRestriction}
              onAvailabilityRatingChange={(value) =>
                group.setFieldValue("availabilityRating", value)
              }
              onRestrictionChange={(value) =>
                group.setFieldValue("restriction", value)
              }
            />
          )}
        </group.Subscribe>

        <group.Subscribe selector={(state) => state.values}>
          {(values) => (
            <SourceFormFields
              sourceBook={values.sourceBook}
              sourcePage={values.sourcePage}
              onSourceBookChange={(value) =>
                group.setFieldValue("sourceBook", value)
              }
              onSourcePageChange={(value) =>
                group.setFieldValue("sourcePage", value)
              }
            />
          )}
        </group.Subscribe>

        <group.AppField name="description">
          {(field) => (
            <field.TextField
              label="Description"
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
