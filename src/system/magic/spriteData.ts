import type { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { EntityDamage } from "#/system/entityData.ts"

export interface SpriteData {
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
