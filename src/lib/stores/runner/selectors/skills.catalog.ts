import type { RunnerData } from "#/system/runnerData.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"

export const skillsCatalog = {
  nativeLanguage: (state: RunnerData): LanguageSkillData | undefined =>
    state.skills.languageSkills.find((skill) => skill.rating === "native"),
}
