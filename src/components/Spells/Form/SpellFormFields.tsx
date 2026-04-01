import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SourceFieldGroup } from "#/components/Sources/SourceFieldGroup.tsx"
import type { SpellForm } from "#/components/Spells/Form/UseSpellForm.ts"

export interface SpellFormFieldsProps {
  form: SpellForm
}

export const SpellFormFields: FC<SpellFormFieldsProps> = ({ form }) => {
  return (
    <form.AppForm>
      <Stack gap={2} sx={{ pt: 1 }}>
        <form.AppField name="name">
          {(field) => <field.TextField label="Name" required />}
        </form.AppField>

        <Stack direction="row" gap={2}>
          <form.AppField name="type">
            {(field) => (
              <field.SelectField
                label="Type"
                required
                sx={{ flexGrow: 1 }}
                options={[
                  { label: "Physical", value: "Physical" },
                  { label: "Mana", value: "Mana" },
                ]}
              />
            )}
          </form.AppField>

          <form.AppField name="damage">
            {(field) => (
              <field.SelectField
                label="Damage"
                required
                sx={{ flexGrow: 1 }}
                options={[
                  { label: "Physical", value: "Physical" },
                  { label: "Stun", value: "Stun" },
                ]}
              />
            )}
          </form.AppField>
        </Stack>

        <form.AppField name="range">
          {(field) => (
            <field.SelectField
              label="Range"
              required
              options={[
                { label: "Touch", value: "Touch" },
                { label: "Line of Sight", value: "LoS" },
                { label: "Line of Sight (Area)", value: "LoS (A)" },
              ]}
            />
          )}
        </form.AppField>

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
