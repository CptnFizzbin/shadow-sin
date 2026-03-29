import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { z } from "zod"

import type {
  LanguageSkillForm,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Hooks/UseLanguageSkillForm.ts"
import { SkillRatingMax } from "#/components/CharacterBuilder/Sections/Skills/SkillUtils.ts"

const ratingOptions = [
  { label: "Native", value: "native" },
  ...Array.from({ length: SkillRatingMax }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  })),
]

interface LanguageSkillFormFieldsProps {
  form: LanguageSkillForm
}

export const LanguageSkillFormFields: FC<LanguageSkillFormFieldsProps> = ({
  form,
}) => {
  return (
    <form.AppForm>
      <Stack gap={2} sx={{ pt: 1 }}>
        <form.AppField
          name="name"
          validators={{ onChange: z.string().min(1, "Language name is required") }}
        >
          {(field) => <field.TextField label="Language" autoFocus />}
        </form.AppField>

        <form.AppField name="rating">
          {(field) => (
            <field.SelectField
              label="Rating"
              fullWidth
              size="small"
              options={ratingOptions}
            />
          )}
        </form.AppField>

        <form.AppField name="lingo">
          {(field) => (
            <field.TextField
              label="Lingo (optional)"
              helperText="Costs 1 SP"
            />
          )}
        </form.AppField>
      </Stack>
    </form.AppForm>
  )
}
