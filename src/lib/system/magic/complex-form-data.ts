import { z } from "zod"

import type { GameEffectData } from '#/lib/system/game-effects/game-effect-data.ts"
import { GameEffectDataSchema } from '#/lib/system/game-effects/game-effect-data.ts"

export interface ComplexFormData {
  id: string
  name: string
  rating: number
  effects?: GameEffectData[]
}

export const ComplexFormDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.number(),
  effects: GameEffectDataSchema.array().optional(),
}) satisfies z.ZodType<ComplexFormData>
