import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerSelector.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData"

interface LanguageSkillFormOptions {
  skill?: LanguageSkillData
  onSubmit: (values: LanguageSkillData) => void
}

const defaultFormValues: LanguageSkillData = {
  name: "",
  rating: 1,
  lingo: "",
}

export const useLanguageSkillForm = ({
  skill,
  onSubmit,
}: LanguageSkillFormOptions) => {
  const nativeLanguage = useRunnerSelector(({ skills }) => skills.nativeLanguage)

  return useAppForm({
    defaultValues: {
      ...defaultFormValues,
      rating: nativeLanguage ? 1 : "native",
      ...skill,
    },
    onSubmit: ({ value }) =>
      onSubmit({
        ...value,
        rating: value.rating === "native" ? "native" : Number(value.rating),
      }),
  })
}

export type LanguageSkillForm = ReturnType<typeof useLanguageSkillForm>
