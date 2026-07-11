import type { SkillsStoreState } from "./skillsStore.ts"

/** @deprecated Use `selectActiveSkills` from `#/stores/runner/skills/skillsSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `SkillsStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectActiveSkills = (state: SkillsStoreState) => state.activeSkills

/** @deprecated Use `selectSkillGroups` from `#/stores/runner/skills/skillsSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `SkillsStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectSkillGroups = (state: SkillsStoreState) => state.skillGroups

/** @deprecated Use `selectKnowledgeSkills` from `#/stores/runner/skills/skillsSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `SkillsStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectKnowledgeSkills = (state: SkillsStoreState) => state.knowledgeSkills

/** @deprecated Use `selectLanguageSkills` from `#/stores/runner/skills/skillsSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `SkillsStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectLanguageSkills = (state: SkillsStoreState) => state.languageSkills
