import { z } from "zod"

import type { GameEffectData } from "./gameEffects/gameEffectData.ts"

/**
 * A player-entered temporary status modifier applied during play.
 * Used for variable bonuses that can't be pre-configured on items or spells —
 * e.g. hit-dependent spell bonuses ("Increase Body, 3 hits"), drug effects, or
 * situational conditions. Entries persist on the sheet and must be removed manually.
 */
export interface ManualStatus {
  id: string
  label: string
  effect: GameEffectData
}

export const ManualStatusSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1),
  effect: z.object({
    type: z.string(),
    target: z.string().optional(),
    subTarget: z.string().optional(),
    value: z.number(),
  }),
}) satisfies z.ZodType<ManualStatus>
