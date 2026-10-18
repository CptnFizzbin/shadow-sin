import { z } from "zod"

export interface KnowledgeSkillData {
  name: string
  rating: number
  specialization?: string
}

export const KnowledgeSkillDataSchema = z.object({
  name: z.string(),
  rating: z.number().int(),
  specialization: z.string().optional(),
}) satisfies z.ZodType<KnowledgeSkillData>
