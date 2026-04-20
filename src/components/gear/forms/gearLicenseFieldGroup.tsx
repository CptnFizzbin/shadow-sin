import { gearItemFormOpts } from "#/components/gear/forms/useItemForm.tsx"
import type { SelectOption } from "#/integrations/tanstackForm/fields/selectField.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

export const GearLicenseFieldGroup = withFieldGroup({
  ...gearItemFormOpts,
  props: {
    sinOptions: [] as SelectOption[],
  },
  render: ({ group, sinOptions }) => {
    return (
      <group.AppField name="parentId">
        {(field) => (
          <field.SelectField
            label="SIN"
            size="small"
            fullWidth
            options={[{ label: "—", value: "" }, ...sinOptions]}
          />
        )}
      </group.AppField>
    )
  },
})
