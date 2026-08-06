import type { GameEffectData } from "./gameEffects/gameEffectData.ts"
import type { Rating } from "./rating.ts"
import type { SourceData } from "./sourceData.ts"

/**
 * A generic, per-track damage container — e.g. `{ physical, stun }` for a Spirit, `{ matrix }`
 * for a Sprite. Track keys are conventional strings rather than a fixed union, so each entity
 * type only carries the tracks it actually uses.
 */
export type EntityDamage = { [track: string]: number }

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
