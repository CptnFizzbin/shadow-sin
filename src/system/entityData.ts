import type { DamageTrackKey } from "./damageTrackKey.ts"
import type { EntityKind } from "./entityKind.ts"
import type { GameEffectData } from "./gameEffects/gameEffectData.ts"
import type { Rating } from "./rating.ts"
import type { SourceData } from "./sourceData.ts"

/**
 * A generic, per-track damage container — e.g. `{ physical, stun }` for a Spirit, `{ matrix }`
 * for a Sprite. Narrow `TTrack` to the specific tracks an entity type uses, e.g.
 * `EntityDamage<DamageTrackKey.matrix>` or `EntityDamage<DamageTrackKey.physical | DamageTrackKey.stun>`.
 */
export type EntityDamage<TTrack extends DamageTrackKey = DamageTrackKey> = { [track in TTrack]: number }

/**
 * Base interface for anything with a stat block, ratings, or effects it can contribute — Item,
 * Quality, Spell, Adept Power, MatrixNode, etc. See CONTEXT.md's Entity glossary entry.
 *
 * `rating` is typed `Rating<string>` (not the plain-number default) so that categories needing
 * their own sentinel (a Real SIN/Licence's `Rating<"real">`) can narrow it without conflicting
 * with this base declaration.
 */
export interface EntityData {
  kind: EntityKind
  id: string
  name: string
  description?: string
  source?: SourceData
  effects?: GameEffectData[]
  rating?: Rating<string>
}
