import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import type { FC } from "react"

import { SourceFieldGroup } from "#/components/CharacterBuilder/General/Form/SourceFieldGroup.tsx"
import type { QualityForm } from "#/components/Qualities/Form/UseQualityForm.ts"

export interface QualityFormFieldsProps {
  form: QualityForm
}

export const QualityFormFields: FC<QualityFormFieldsProps> = ({ form }) => {
  return (
    <form.AppForm>
      <Stack gap={2} sx={{ pt: 1 }}>
        <form.AppField name="name">
          {(field) => <field.TextField label="Name" required />}
        </form.AppField>

        <Stack direction="row" gap={1} alignItems="center">
          <form.AppField name="type">
            {(field) => (
              <ToggleButton
                value="positive"
                selected={field.state.value === "positive"}
                onChange={() =>
                  field.handleChange(
                    field.state.value === "positive" ? "negative" : "positive",
                  )}
                size="small"
                sx={{ flexGrow: 1 }}
              >
                {field.state.value === "positive" ? "Positive" : "Negative"}
              </ToggleButton>
            )}
          </form.AppField>

          <form.Subscribe selector={(form) => form.values.type}>
            {(type) => (
              <form.AppField name="bpValue">
                {(field) => (
                  <field.NumberField
                    label={type === "positive" ? "BP Cost" : "BP Bonus"}
                    sx={{ width: 120 }}
                  />
                )}
              </form.AppField>
            )}
          </form.Subscribe>
        </Stack>

        <form.AppField name="description">
          {(field) => (
            <field.TextField label="Description" multiline rows={4} />
          )}
        </form.AppField>

        <SourceFieldGroup form={form} fields={{ source: "source" }} />
      </Stack>
    </form.AppForm>
  )
}
