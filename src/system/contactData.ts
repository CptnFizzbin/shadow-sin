import type { UUID } from "#/lib/uuidUtils.ts"

import type { FavourData } from "./favourData.ts"
import type { KnowledgeSkillData } from "./skills/knowledgeSkillData.ts"

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
