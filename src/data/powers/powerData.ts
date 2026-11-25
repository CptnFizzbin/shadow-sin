import type { GameEffectData } from "#/data/gameEffects/gameEffectData.ts"
import type { SourceData } from "#/data/source/sourceData.ts"

/**
 * Base interface shared by all power types (adept powers, critter powers, etc.).
 */
export interface PowerData {
  type: string
  id: string
  name: string
  description?: string
  source?: SourceData
  effects?: GameEffectData[]
}
