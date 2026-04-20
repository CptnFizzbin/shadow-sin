import { gearItemFormOpts } from "#/components/gear/forms/useItemForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

export const GearDescriptionFieldGroup = withFieldGroup({
  ...gearItemFormOpts,
  render: ({ group }) => {
    return (
      <group.AppField name="description">
        {(field) => (
          <field.TextField label="Description" fullWidth multiline rows={3} />
        )}
      </group.AppField>
    )
  },
})
