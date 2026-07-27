import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { itemFormOpts } from "#/lib/hooks/items/forms/useItemForm.tsx"

export const GearDescriptionFieldGroup = withFieldGroup({
  ...itemFormOpts,
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
