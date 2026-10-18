import { z } from "zod"

import type { KnowledgeSkillData } from "#/system/model/skills/knowledgeSkillData.ts"
import { KnowledgeSkillDataSchema } from "#/system/model/skills/knowledgeSkillData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import type { FavourData } from "./favourData.ts"
import { FavourDataSchema } from "./favourData.ts"

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

export const ContactDataSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  connection: z.number().int(),
  loyalty: z.number().int(),
  role: z.string().optional(),
  notes: z.string().optional(),
  knowledgeSkills: z.array(KnowledgeSkillDataSchema).optional(),
  favours: z.array(FavourDataSchema).optional(),
}) satisfies z.ZodType<ContactData>
