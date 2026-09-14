import type { KnowledgeSkillData } from "#/system/model/skills/knowledgeSkillData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import type { FavourData } from "./favourData.ts"

export interface ContactData {
  id: UUID
  name: string

  connection: number
  loyalty: number

  role?: string

  notes?: string

  knowledgeSkills?: KnowledgeSkillData[]
  favours?: FavourData[]
}
