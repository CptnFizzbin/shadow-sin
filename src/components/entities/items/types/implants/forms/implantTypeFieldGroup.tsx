import { implantFormOpts } from "#/hooks/items/types/implants/forms/useImplantForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { ImplantType } from "#/system/model/items/implantData.ts"

const implantTypeOptions = [
  { label: "Cyberware", value: ImplantType.cyberware },
  { label: "Bioware", value: ImplantType.bioware },
]

/** The implant's type (Cyberware / Bioware), shown directly below its name. */
export const ImplantTypeFieldGroup = withFieldGroup({
  ...implantFormOpts,
  render: ({ group }) => (
    <group.AppField name="implantType">
      {(field) => (
        <field.SelectField
          label="Type"
          size="small"
          fullWidth
          options={implantTypeOptions}
        />
      )}
    </group.AppField>
  ),
})
