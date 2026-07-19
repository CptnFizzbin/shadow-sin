import type { UUID } from "node:crypto"

import type { KnowledgeSkillData } from "./skills/knowledgeSkillData.ts"

export interface ContactData {
  id: UUID
  name: string

  connection: number
  loyalty: number

  role?: string

  notes?: string

  knowledgeSkills?: KnowledgeSkillData[]
}
