import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"
import { z } from "zod"

import type { LanguageSkillForm } from "#/hooks/runner/skills/knowledgeSkills/forms/useLanguageSkillForm.ts"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { SkillRatingMax } from "#/system/skills/skillUtils.ts"

interface LanguageSkillFormFieldsProps {
  form: LanguageSkillForm
}

export const LanguageSkillFormFields: FC<LanguageSkillFormFieldsProps> = ({
  form,
}) => {
  const skillName = useSelector(form.store, (state) => state.values.name)
  const nativeLanguage = useRunnerStoreSelector((sheet) => {
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
      <Stack sx={{ pt: 1 }}>
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
