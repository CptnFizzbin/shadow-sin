import { z } from "zod"

/** Which of a Contact's skill lists a skill belongs to. */
export enum ContactSkillType {
  keyActive = "keyActive",
  knowledge = "knowledge",
}

/** A skill a Contact is known for — unrated, since only the Contact's Connection and Loyalty are rolled. */
export interface ContactSkillData {
  name: string
  type: ContactSkillType
  specialization?: string
}

// An imported skill without a type predates the Key Active / Knowledge split, when every
// contact skill was a knowledge skill.
export const ContactSkillDataSchema = z.object({
  name: z.string(),
  type: z.enum(ContactSkillType).default(ContactSkillType.knowledge),
  specialization: z.string().optional(),
}) satisfies z.ZodType<ContactSkillData>
