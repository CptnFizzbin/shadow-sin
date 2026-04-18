import Stack from "@mui/material/Stack"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { z } from "zod"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import type {
  LanguageSkillForm,
} from "#/components/characterBuilder/sections/skills/knowledgeSkills/hooks/useLanguageSkillForm.ts"
import { SkillRatingMax } from "#/components/characterBuilder/sections/skills/skillsBuilderUtils.ts"

interface LanguageSkillFormFieldsProps {
  form: LanguageSkillForm
}

export const LanguageSkillFormFields: FC<LanguageSkillFormFieldsProps> = ({
  form,
}) => {
  const skillName = useStore(form.store, (state) => state.values.name)
  const nativeLanguage = useCharacterSheet((sheet) => {
    return sheet.skills.languageSkills.find((skill) => skill.rating === "native")
  })

  const ratingOptions = [
    { label: "Native", value: "native", disabled: nativeLanguage && nativeLanguage.name !== skillName },
    ...Array.from({ length: SkillRatingMax }, (_, i) => ({
      label: String(i + 1),
      value: String(i + 1),
    })),
  ]

  return (
    <form.AppForm>
      <Stack sx={{ gap: 1, pt: 1 }}>
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
