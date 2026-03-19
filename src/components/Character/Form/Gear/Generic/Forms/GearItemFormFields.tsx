import { z } from "zod"
import { gearItemFormOpts } from "#/components/Character/Form/Gear/Generic/Forms/UseGearItemForm.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"

const restrictionOptions = [
  { label: "None", value: "none" },
  { label: "Restricted", value: "restricted" },
  { label: "Forbidden", value: "forbidden" },
]

export const GearItemFormFields = withFieldGroup({
  ...gearItemFormOpts,
  render: ({ group }) => {
    return (
      <>
        <group.AppField
          name="name"
          validators={{ onChange: z.string().min(1, "Name is required") }}
        >
          {(field) => (
            <field.TextField label="Name" fullWidth size="small" autoFocus />
          )}
        </group.AppField>

        <group.AppField name="cost">
          {(field) => (
            <field.NumberField
              label="Cost (¥)"
              fullWidth
              size="small"
              inputProps={{ min: 0 }}
            />
          )}
        </group.AppField>

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

        <group.AppField name="availabilityRating">
          {(field) => (
            <field.NumberField
              label="Availability Rating"
              fullWidth
              size="small"
              inputProps={{ min: 0 }}
            />
          )}
        </group.AppField>

        <group.AppField name="availabilityRestriction">
          {(field) => (
            <field.SelectField
              label="Restriction"
              fullWidth
              size="small"
              options={restrictionOptions}
            />
          )}
        </group.AppField>

        <group.AppField name="sourceBook">
          {(field) => (
            <field.TextField label="Source Book" fullWidth size="small" />
          )}
        </group.AppField>

        <group.AppField name="sourcePage">
          {(field) => (
            <field.NumberField
              label="Source Page"
              fullWidth
              size="small"
              inputProps={{ min: 0 }}
            />
          )}
        </group.AppField>
      </>
    )
  },
})
