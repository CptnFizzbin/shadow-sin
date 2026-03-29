import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { LanguageSkillData } from "#/lib/system/skillData.ts"

export interface LanguageSkillFormOptions {
  skill?: LanguageSkillData
  onSubmit: (values: LanguageSkillData) => void
}

const defaultFormValues = {
  name: "",
  rating: "1",
  lingo: "",
}

export const useLanguageSkillForm = ({
  skill,
  onSubmit,
}: LanguageSkillFormOptions) => {
  return useAppForm({
    defaultValues: {
      ...defaultFormValues,
      ...skill,
    },
    onSubmit: ({ value }) =>
      onSubmit({
        name: value.name.trim(),
        rating: value.rating === "native" ? "native" : Number(value.rating),
        lingo: value.lingo.trim() || undefined,
      }),
  })
}

export type LanguageSkillForm = ReturnType<typeof useLanguageSkillForm>
