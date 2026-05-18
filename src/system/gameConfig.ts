import { z } from "zod"

import type { HouseRules } from "./houseRules.ts"
import { HouseRulesSchema } from "./houseRules.ts"

/**
 * GM-level campaign configuration. Provides a baseline set of house rules
 * that character-level settings then override at runtime. The shape aligns
 * with the planned GM Game feature (`docs/issues/gm-game.md`).
 *
 * `houseRules` is `Partial<HouseRules>` so the GM only specifies rules that
 * differ from SR4e defaults; an empty object means run stock SR4e.
 */
export interface GameConfig {
  name: string
  houseRules: Partial<HouseRules>
}

export const GameConfigSchema = z.object({
  name: z.string(),
  houseRules: HouseRulesSchema.partial(),
}) satisfies z.ZodType<GameConfig>

export const defaultGameConfig: GameConfig = {
  name: "",
  houseRules: {},
}
