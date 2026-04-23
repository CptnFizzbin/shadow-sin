import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData"

export interface LanguageSkillFormOptions {
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
  const nativeLanguage = useCharacterSheet((sheet) => {
    return sheet.skills.languageSkills.find((s) => s.rating === "native")
  })

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
