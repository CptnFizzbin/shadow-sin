import Stack from "@mui/material/Stack"

import { programFormOpts } from "#/hooks/items/types/devices/forms/useProgramForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { ProgramType } from "#/system/gear/programData.ts"

const splitCamelCase = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
const titleCase = (s: string) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

const programTypeOptions = Object.values(ProgramType).map((programType) => ({
  label: titleCase(splitCamelCase(programType)),
  value: programType,
}))

export const ProgramFormFields = withFieldGroup({
  ...programFormOpts,
  render: ({ group }) => {
    return (
      <Stack>
        <group.AppField name="programType">
          {(field) => (
            <field.SelectField
              label="Program Type"
              fullWidth
              size="small"
              options={programTypeOptions}
            />
          )}
        </group.AppField>
      </Stack>
    )
  },
})
