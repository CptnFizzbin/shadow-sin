import type { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { EntityDamage } from "#/system/entityData.ts"
import type { EntityKind } from "#/system/entityKind.ts"

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
