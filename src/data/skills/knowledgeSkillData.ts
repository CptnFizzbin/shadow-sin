import { z } from "zod"

import type { UUID } from "#/utils/uuidUtils.ts"

export interface KnowledgeSkillData {
  /** Stays the same when the skill is renamed. */
  id: UUID
  name: string
  rating: number
  specialization?: string
}

export const KnowledgeSkillDataSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  rating: z.number().int(),
  specialization: z.string().optional(),
}) satisfies z.ZodType<KnowledgeSkillData>
