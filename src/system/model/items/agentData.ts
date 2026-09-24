import type { DamageTrackKey } from "#/system/model/entities/damageTrackKey.ts"
import type { EntityDamage } from "#/system/model/entities/entityData.ts"
import type { EntityWithAttrs } from "#/system/model/entities/traits/entityWithAttrs.ts"
import type { EntityWithDamage } from "#/system/model/entities/traits/entityWithDamage.ts"

import type { ItemData } from "./itemData.ts"
import { ItemType } from "./itemType.ts"
import type { ProgramData } from "./programData.ts"
import { ProgramType } from "./programData.ts"

/**
 * An autonomous Program — an `Item`/`Program` subtype (`Entity → Item → Program → Agent`) that
 * carries its own `attributes` bag and Matrix damage track, rather than the single `rating` a
 * plain Program uses. See CONTEXT.md's **Agent** glossary entry.
 */
export interface AgentData extends ProgramData, EntityWithAttrs, EntityWithDamage {
  programType: ProgramType.agent
  damage: EntityDamage<DamageTrackKey.matrix>
}

export function isAgentData(item: ItemData): item is AgentData {
  return item.itemType === ItemType.program && (item as ProgramData).programType === ProgramType.agent
}
