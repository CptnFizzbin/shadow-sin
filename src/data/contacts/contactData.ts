import { z } from "zod"

import type { UUID } from "#/utils/uuidUtils.ts"

import type { ContactSkillData } from "./contactSkillData.ts"
import { ContactSkillDataSchema } from "./contactSkillData.ts"
import type { FavourData } from "./favourData.ts"
import { FavourDataSchema } from "./favourData.ts"

export interface ContactData {
  id: UUID
  name: string

  connection: number
  loyalty: number

  role?: string

  notes?: string

  skills?: ContactSkillData[]
  favours?: FavourData[]
}

/** Moves a contact's `knowledgeSkills` into `skills`, so contacts shared before the skill-type split still import. */
const liftLegacyKnowledgeSkills = (input: unknown): unknown => {
  if (typeof input !== "object" || input === null || !("knowledgeSkills" in input)) return input
  const { knowledgeSkills, ...contact } = input as Record<string, unknown>
  return "skills" in contact ? contact : { ...contact, skills: knowledgeSkills }
}

export const ContactDataSchema = z.preprocess(liftLegacyKnowledgeSkills, z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  connection: z.number().int(),
  loyalty: z.number().int(),
  role: z.string().optional(),
  notes: z.string().optional(),
  skills: z.array(ContactSkillDataSchema).optional(),
  favours: z.array(FavourDataSchema).optional(),
})) satisfies z.ZodType<ContactData>
