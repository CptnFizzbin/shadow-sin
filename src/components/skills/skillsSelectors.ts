import type { SkillsStoreState } from "#/components/skills/skillsStore.ts"

export const selectActiveSkills = (state: SkillsStoreState) => state.activeSkills
export const selectSkillGroups = (state: SkillsStoreState) => state.skillGroups
export const selectKnowledgeSkills = (state: SkillsStoreState) => state.knowledgeSkills
export const selectLanguageSkills = (state: SkillsStoreState) => state.languageSkills
