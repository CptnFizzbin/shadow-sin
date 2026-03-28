import Stack from "@mui/material/Stack"
import { z } from "zod"

import { AvailabilityFieldGroup } from "#/components/CharacterBuilder/General/Form/AvailabilityFieldGroup.tsx"
import { SourceFieldGroup } from "#/components/CharacterBuilder/General/Form/SourceFieldGroup.tsx"
import {
  gearItemFieldMap,
  gearItemFormOpts,
} from "#/components/CharacterBuilder/Sections/Gear/Generic/Forms/UseGearItemForm.tsx"
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

        <group.AppField
          name="quantity"
          validators={{
            onChange: z
              .number("Quantity is required")
              .int("Quantity must be a whole number")
              .min(1, "Quantity must be at least 1"),
          }}
        >
          {(field) => (
            <field.NumberField
              label="Quantity"
              size="small"
              sx={{ width: 120 }}
              slotProps={{ htmlInput: { min: 1, step: 1 } }}
            />
          )}
        </group.AppField>
      </Stack>
    )
  },
})
