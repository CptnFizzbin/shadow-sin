import type { Selector } from "reselect"

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

// Catalog-internal — deliberately not exported from skillsSlice.selectors.ts alongside it, since
// useRunnerSelector's skills namespace is the only intended reader. See
// docs/adr/0013-unify-runner-state-access.md.
const selectNativeLanguageSkill: Selector<RunnerData, LanguageSkillData | undefined> = (state) =>
  state.skills.languageSkills.find((skill) => skill.rating === "native")

export const skillsCatalog = {
  activeSkills: selectActiveSkills,
  skillGroups: selectSkillGroups,
  knowledgeSkills: selectKnowledgeSkills,
  languageSkills: selectLanguageSkills,
  nativeLanguage: selectNativeLanguageSkill,
  forSkill: (skill: SkillKey) => ({
    specialization: selectSkillSpecialization(skill),
  }),
}
