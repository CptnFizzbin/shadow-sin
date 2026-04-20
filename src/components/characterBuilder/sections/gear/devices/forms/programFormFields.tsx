import Stack from "@mui/material/Stack"
import { z } from "zod"

import { AvailabilityFieldGroup } from "#/components/availablity/availabilityFieldGroup.tsx"
import { programFormOpts } from "#/components/characterBuilder/sections/gear/devices/forms/useProgramForm.tsx"
import { SourceFieldGroup } from "#/components/sources/sourceFieldGroup.tsx"
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
        <group.AppField
          name="name"
          validators={{ onChange: z.string().min(1, "Name is required") }}
        >
          {(field) => (
            <field.TextField label="Name" fullWidth size="small" autoFocus />
          )}
        </group.AppField>

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

        <Stack direction="row" sx={{ gap: 1 }}>
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

          <group.AppField
            name="cost"
            validators={{
              onChange: z.number().min(0, "Cost must be 0 or more"),
            }}
          >
            {(field) => (
              <field.NumberField label="Cost (¥)" size="small" sx={{ flex: 1 }} />
            )}
          </group.AppField>
        </Stack>

        <AvailabilityFieldGroup form={group} fields="availability" />
        <SourceFieldGroup form={group} fields={{ source: "source" }} />

        <group.AppField name="description">
          {(field) => (
            <field.TextField
              label="Description / Notes"
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          )}
        </group.AppField>
      </Stack>
    )
  },
})
