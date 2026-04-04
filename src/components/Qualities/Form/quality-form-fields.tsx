import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import type { FC } from "react"
import { z } from "zod"

import { GameEffectsFieldGroup } from "#/components/GameEffects/game-effects-field-group.tsx"
import type { QualityForm } from "#/components/Qualities/Form/use-quality-form.ts"
import { SourceFieldGroup } from "#/components/Sources/source-field-group.tsx"

export interface QualityFormFieldsProps {
  form: QualityForm
}

export const QualityFormFields: FC<QualityFormFieldsProps> = ({ form }) => {
  return (
    <form.AppForm>
      <Stack gap={2} sx={{ pt: 1 }}>
        <form.AppField name="name" validators={{ onChange: z.string().min(1, "Name is required") }}>
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

          <form.Subscribe selector={(g) => g.values.type}>
            {(type) => (
              <form.AppField
                name="bpValue"
                validators={{ onChange: z.number().int().min(0, "BP must be 0 or greater").optional() }}
              >
                {(field) => (
                  <field.NumberField
                    label={type === "positive" ? "BP Cost" : "BP Bonus"}
                    sx={{ width: 120 }}
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
                  />
                )}
              </form.AppField>
            )}
          </form.Subscribe>

          <form.AppField
            name="rating"
            validators={{ onChange: z.number().int().min(1, "Rating must be at least 1").optional() }}
          >
            {(field) => (
              <field.NumberField
                label="Rating"
                sx={{ width: 120 }}
                slotProps={{ htmlInput: { min: 1, step: 1 } }}
              />
            )}
          </form.AppField>
        </Stack>

        <form.AppField name="description">
          {(field) => (
            <field.TextField label="Description" multiline rows={4} />
          )}
        </form.AppField>

        <SourceFieldGroup form={form} fields={{ source: "source" }} />

        <GameEffectsFieldGroup form={form} fields={{ effects: "effects" }} />
      </Stack>
    </form.AppForm>
  )
}
