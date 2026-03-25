import Stack from "@mui/material/Stack"
import type { FC } from "react"

import type { AdeptPowerForm } from "#/components/AdeptPowers/Form/UseAdeptPowerForm.ts"
import { SourceFieldGroup } from "#/components/CharacterBuilder/General/Form/SourceFieldGroup.tsx"

export interface AdeptPowerFormFieldsProps {
  form: AdeptPowerForm
}

export const AdeptPowerFormFields: FC<AdeptPowerFormFieldsProps> = ({
  form,
}) => {
  return (
    <form.AppForm>
      <Stack gap={2} sx={{ pt: 1 }}>
        <form.AppField name="name">
          {(field) => <field.TextField label="Name" required />}
        </form.AppField>

        <Stack direction="row" gap={2}>
          <form.AppField name="rating">
            {(field) => (
              <field.NumberField
                label="Rating"
                required
                sx={{ flexGrow: 1 }}
                slotProps={{ htmlInput: { min: 1, step: 1 } }}
              />
            )}
          </form.AppField>

          <form.AppField name="costPerRating">
            {(field) => (
              <field.NumberField
                label="Cost per Rating (PP)"
                required
                sx={{ flexGrow: 1 }}
                slotProps={{ htmlInput: { min: 0, step: 0.25 } }}
              />
            )}
          </form.AppField>
        </Stack>

        <form.AppField name="description">
          {(field) => (
            <field.TextField label="Description" multiline rows={3} />
          )}
        </form.AppField>

        <SourceFieldGroup form={form} fields={{ source: "source" }} />
      </Stack>
    </form.AppForm>
  )
}
