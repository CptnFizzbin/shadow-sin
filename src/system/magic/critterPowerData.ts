import { z } from "zod"

import { GameEffectDataSchema } from "#/system/gameEffects/gameEffectData.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

import type { PowerData } from "./powerData.ts"

/**
 * Represents an innate critter power.
 */
export interface CritterPowerData extends PowerData {
}

/**
 * Zod schema for validating CritterPowerData.
 */
export const CritterPowerDataSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  source: SourceDataSchema.optional(),
  effects: z.array(GameEffectDataSchema).optional(),
}) satisfies z.ZodType<CritterPowerData>
