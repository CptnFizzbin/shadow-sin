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

  // Sprites only track matrix damage — see EntityDamage for the shared, generic shape.
  damage: EntityDamage & {
    matrix: number
  }
}
