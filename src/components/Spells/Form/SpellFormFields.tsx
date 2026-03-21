import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SourceField } from "#/components/Sources/SourceField.tsx"
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

        <form.AppField name="source">
          {(field) => {
            const book = field.state.value?.book ?? ""
            const page = field.state.value?.page?.toString() ?? ""

            return (
              <SourceField
                book={book}
                page={page}
                onBookChange={(newBook) =>
                  field.handleChange(
                    newBook
                      ? { book: newBook, page: Number(page) || 0 }
                      : undefined,
                  )
                }
                onPageChange={(newPage) =>
                  field.handleChange(
                    book
                      ? { book, page: Number(newPage) || 0 }
                      : { book: "", page: Number(newPage) || 0 },
                  )
                }
              />
            )
          }}
        </form.AppField>
      </Stack>
    </form.AppForm>
  )
}
