import { z } from "zod"

import type { FeatureFlagsData } from "./featureFlags/featureFlagsData.ts"
import { FeatureFlagsDataSchema } from "./featureFlags/featureFlagsData.ts"

/**
 * GM-level campaign configuration. Provides a baseline set of feature flags
 * that runner-level settings can then override at runtime. The shape aligns
 * with the planned GM Game feature (`docs/issues/gm-game.md`).
 *
 * `featureFlags` is optional so an absent value means "all SR4e defaults".
 */
export interface GameConfig {
  name: string
  featureFlags?: FeatureFlagsData
}

export const GameConfigSchema = z.object({
  name: z.string(),
  featureFlags: FeatureFlagsDataSchema.optional(),
}) satisfies z.ZodType<GameConfig>

export const defaultGameConfig: GameConfig = {
  name: "",
}
