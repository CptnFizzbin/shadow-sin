import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import type { SourceData } from "#/system/sourceData.ts"

/**
 * Base interface shared by all power types (adept powers, critter powers, etc.).
 */
export interface PowerData {
  id: string
  name: string
  description?: string
  source?: SourceData
  effects?: GameEffectData[]
}
