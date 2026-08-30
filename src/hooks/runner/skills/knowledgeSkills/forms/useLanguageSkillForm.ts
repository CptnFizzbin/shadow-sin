import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"

interface LanguageSkillFormOptions {
  skill?: LanguageSkillData
  onSubmit: (values: LanguageSkillData) => void
}

/**
 * Flat editing shape backing the form's single "Rating" select (`ratingSelect`, matching its
 * MUI `Select`'s string-only options: `"native"` or a stringified numeric rating). Converted to
 * `LanguageSkillData`'s `isNative`-discriminated union only at submit time.
 */
interface LanguageSkillFormValues {
  name: string
  ratingSelect: string
  lingo?: string
}

const defaultFormValues: LanguageSkillFormValues = {
  name: "",
  ratingSelect: "1",
  lingo: "",
}

export const useLanguageSkillForm = ({
  skill,
  onSubmit,
}: LanguageSkillFormOptions) => {
  const languageSkills = useRunnerSelector(SkillsSelectors.selectLanguageSkills)
  const nativeLanguageExists = languageSkills.some((s) => s.isNative)

  const skillDefaults: Partial<LanguageSkillFormValues> = skill
    ? {
        name: skill.name,
        lingo: skill.lingo,
        ratingSelect: skill.isNative ? "native" : String(skill.rating),
      }
    : {}

  return useAppForm({
    defaultValues: {
      ...defaultFormValues,
      ratingSelect: nativeLanguageExists ? "1" : "native",
      ...skillDefaults,
    },
    onSubmit: ({ value }) =>
      onSubmit(value.ratingSelect === "native"
        ? { name: value.name, isNative: true, lingo: value.lingo }
        : { name: value.name, isNative: false, rating: Number(value.ratingSelect), lingo: value.lingo }),
  })
}

export type LanguageSkillForm = ReturnType<typeof useLanguageSkillForm>
