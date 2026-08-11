import {
  selectActiveSkills,
  selectKnowledgeSkills,
  selectLanguageSkills,
  selectSkillGroups,
  selectSkillSpecialization,
} from "#/lib/stores/runner/skills/skillsSlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

export const skillsCatalog = {
  activeSkills: selectActiveSkills,
  skillGroups: selectSkillGroups,
  knowledgeSkills: selectKnowledgeSkills,
  languageSkills: selectLanguageSkills,
  nativeLanguage: (state: RunnerData): LanguageSkillData | undefined =>
    state.skills.languageSkills.find((skill) => skill.rating === "native"),
  forSkill: (skill: SkillKey) => ({
    specialization: selectSkillSpecialization(skill),
  }),
}
