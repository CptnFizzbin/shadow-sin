import type { GameEffectData } from "./gameEffects/gameEffectData.ts"
import type { Rating } from "./rating.ts"
import type { SourceData } from "./sourceData.ts"

/**
 * Base interface for anything with a stat block, ratings, or effects it can contribute — Item,
 * Quality, Spell, Adept Power, MatrixNode, etc. See CONTEXT.md's Entity glossary entry.
 *
 * `rating` is typed `Rating<string>` (not the plain-number default) so that categories needing
 * their own sentinel (a Real SIN/Licence's `Rating<"real">`) can narrow it without conflicting
 * with this base declaration.
 */
export interface EntityData {
  id: string
  name: string
  description?: string
  source?: SourceData
  effects?: GameEffectData[]
  rating?: Rating<string>
}
