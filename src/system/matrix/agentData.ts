import type { UUID } from "node:crypto"

import { z } from "zod"

export interface AgentData {
  id: UUID
  name: string
  /** SR4A p.243: an Agent's Pilot rating, and every Matrix attribute it uses on its own, equals its rating. */
  rating: number
  notes?: string
}

export const AgentDataSchema = z.object({
  id: z.uuid() as z.ZodType<UUID>,
  name: z.string(),
  rating: z.number().int().min(1).max(6),
  notes: z.string().optional(),
}) satisfies z.ZodType<AgentData>
