import type { DamageTrackKey } from "./damageTrackKey.ts"
import type { EntityKind } from "./entityKind.ts"
import type { GameEffectData } from "./gameEffects/gameEffectData.ts"
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
 * `rating` is always a plain number. A category whose rating admits its own unrated/default case
 * (a Real SIN/Licence, a native Language skill) expresses that with its own explicit flag
 * (`isReal`, `isNative`) instead of a sentinel value here — see CONTEXT.md's **Rating** entry.
 */
export interface EntityData {
  kind: EntityKind
  id: string
  name: string
  description?: string
  source?: SourceData
  effects?: GameEffectData[]
  rating?: number
}
