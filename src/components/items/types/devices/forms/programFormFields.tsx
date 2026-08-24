import Stack from "@mui/material/Stack"

import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { programFormOpts } from "#/lib/hooks/items/types/devices/forms/useProgramForm.tsx"
import { SelectorOptions } from "#/system/selectorOptions.tsx"

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
              options={SelectorOptions.programType}
            />
          )}
        </group.AppField>
      </Stack>
    )
  },
})
