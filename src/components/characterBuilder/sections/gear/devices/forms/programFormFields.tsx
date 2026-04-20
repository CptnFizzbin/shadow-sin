import Stack from "@mui/material/Stack"
import { z } from "zod"

import { programFormOpts } from "#/components/characterBuilder/sections/gear/devices/forms/useProgramForm.tsx"
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
      <Stack sx={{ gap: 1 }}>
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

        <group.AppField
          name="rating"
          validators={{
            onChange: z.number().int().min(0, "Rating must be 0 or more"),
          }}
        >
          {(field) => (
            <field.NumberField
              label="Rating"
              size="small"
              sx={{ flex: 1 }}
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
            />
          )}
        </group.AppField>
      </Stack>
    )
  },
})
