import { createAction } from "@reduxjs/toolkit"

import type { UUID } from "#/common/uuid/uuidUtils.ts"
import type { ActiveSkillData } from "#/data/skills/activeSkillData.ts"
import type { KnowledgeSkillData } from "#/data/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#/data/skills/languageSkillData.ts"
import type { SkillGroupData } from "#/data/skills/skillGroupData.ts"

export const setActiveSkill = createAction<ActiveSkillData>("skills/setActiveSkill")
export const removeActiveSkill = createAction<string>("skills/removeActiveSkill")
export const setSkillGroup = createAction<SkillGroupData>("skills/setSkillGroup")
export const removeSkillGroup = createAction<string>("skills/removeSkillGroup")
export const setKnowledgeSkill = createAction<KnowledgeSkillData>("skills/setKnowledgeSkill")
/** Removes the Knowledge Skill with the given `id`. */
export const removeKnowledgeSkill = createAction<UUID>("skills/removeKnowledgeSkill")
export const setLanguageSkill = createAction<LanguageSkillData>("skills/setLanguageSkill")
/** Removes the Language Skill with the given `id`. */
export const removeLanguageSkill = createAction<UUID>("skills/removeLanguageSkill")
