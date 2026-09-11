import { z } from "zod"

import type { ActiveSkillData } from "#/system/skills/activeSkillData.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"
import { LanguageSkillDataSchema } from "#/system/skills/languageSkillData.ts"
import type { SkillGroupData } from "#/system/skills/skillGroupData.ts"

export interface EntityWithSkills {
  skills: {
    activeSkills: ActiveSkillData[]
    skillGroups: SkillGroupData[]
    knowledgeSkills: KnowledgeSkillData[]
    languageSkills: LanguageSkillData[]
  }
}

export const EntityWithSkillsSchmea = z.object({
  skills: z.object({
    // TODO: add in proper schemas for these
    activeSkills: z.any().array(),
    skillGroups: z.any().array(),
    knowledgeSkills: z.any().array(),
    languageSkills: LanguageSkillDataSchema.array(),
  }),
}) satisfies z.ZodType<EntityWithSkills>

export const isEntityWithSkills = (obj: object): obj is EntityWithSkills => {
  return EntityWithSkillsSchmea.safeParse(obj).success
}
