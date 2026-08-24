import { createAction } from "@reduxjs/toolkit"

import type { ActiveSkillData } from "#/system/skills/activeSkillData.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"
import type { SkillGroupData } from "#/system/skills/skillGroupData.ts"

export const setActiveSkill = createAction<ActiveSkillData>("skills/setActiveSkill")
export const removeActiveSkill = createAction<string>("skills/removeActiveSkill")
export const setSkillGroup = createAction<SkillGroupData>("skills/setSkillGroup")
export const removeSkillGroup = createAction<string>("skills/removeSkillGroup")
export const setKnowledgeSkill = createAction<KnowledgeSkillData>("skills/setKnowledgeSkill")
export const removeKnowledgeSkill = createAction<string>("skills/removeKnowledgeSkill")
export const setLanguageSkill = createAction<LanguageSkillData>("skills/setLanguageSkill")
export const removeLanguageSkill = createAction<string>("skills/removeLanguageSkill")
