import { ImplantType } from "#data/items/implantData.ts"
import { implantFormOpts } from "#forms/items/types/implants/useImplantForm.tsx"
import { withFieldGroup } from "#forms/tanstackForm/useAppForm.ts"

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
