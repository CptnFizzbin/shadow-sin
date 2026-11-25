import { z } from "zod"

import type { UUID } from "#/utils/uuidUtils.ts"

/** Which of a Contact's skill lists a skill belongs to. */
export enum ContactSkillType {
  keyActive = "keyActive",
  knowledge = "knowledge",
}

/** A skill a Contact is known for — unrated, since only the Contact's Connection and Loyalty are rolled. */
export interface ContactSkillData {
  id: UUID
  name: string
  type: ContactSkillType
  specialization?: string
}

export const ContactSkillDataSchema = z.object({
  // Skills shared before they carried ids get one on import, so each can still be edited on its own.
  id: z.uuid().default(() => crypto.randomUUID()),
  name: z.string(),
  // An imported skill without a type predates the Key Active / Knowledge split, when every
  // contact skill was a knowledge skill.
  type: z.enum(ContactSkillType).default(ContactSkillType.knowledge),
  specialization: z.string().optional(),
}) satisfies z.ZodType<ContactSkillData>
