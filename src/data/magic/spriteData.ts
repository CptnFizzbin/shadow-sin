import type { DamageTrackKey } from "#/data/entities/damageTrackKey.ts"
import type { EntityDamage } from "#/data/entities/entityData.ts"
import type { EntityKind } from "#/data/entities/entityKind.ts"

export interface SpriteData {
  kind: EntityKind.sprite
  id: string
  name: string
  force: number
  services: {
    max: number
    used: number
  }

  bound?: boolean

  source?: {
    book: string
    page: number
  }

  notes?: string

  damage: EntityDamage<DamageTrackKey.matrix>
}
