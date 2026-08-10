import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { selectNativeLanguageSkill } from "#/lib/stores/runner/skills/skillsSlice.selectors.ts"
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
  const nativeLanguage = useRunnerStoreSelector(selectNativeLanguageSkill)

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
