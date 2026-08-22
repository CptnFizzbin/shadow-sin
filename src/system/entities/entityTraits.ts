import type { AttributeKey } from "#/system/attributeKey.ts"
import type { EntityData } from "#/system/entityData.ts"
import type { QualityData } from "#/system/qualityData.ts"

export type EntityBase = EntityData

export interface EntityWithItems {
  items: {
    parentId: string | null
    childIds: string[]
  }
}

export interface EntityWithDamage {
  damage: {
    [track: string]: number
  }
}

export interface EntityWithAttrs {
  attributes: Partial<Record<AttributeKey, number>>
}

export interface EntityWithQualities {
  qualities: QualityData[]
}
