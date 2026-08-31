import { z } from "zod"

import type { Credential } from "#/system/entities/entityTraits.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectDataSchema } from "#/system/gameEffects/gameEffectData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

/**
 * A held identity. `isReal: true` is a Real SIN — issued by a government, never rolled, always
 * clears a License Check — while `isReal: false` is a fake SIN carrying a forgery-quality
 * `rating`. See CONTEXT.md's **SIN** glossary entry.
 */
export interface SinData extends ItemData, Credential {
  itemType: ItemType.sin
}

export function isSinData(item: ItemData): item is SinData {
  return item.itemType === ItemType.sin
}

/**
 * Zod schema for validating SinData.
 */
export const SinDataSchema = z.object({
  kind: z.literal(EntityKind.item),
  id: z.uuid(),
  itemType: z.literal(ItemType.sin),
  name: z.string().min(1, "Name is required"),
  isReal: z.boolean(),
  rating: z.number().int().min(1).optional(),
  description: z.string().optional(),
  source: SourceDataSchema.optional(),
  effects: z.array(GameEffectDataSchema).optional(),
  cost: z.number().optional(),
  quantity: z.number().optional(),
  availability: z.object({
    rating: z.number(),
    restricted: z.boolean().optional(),
    forbidden: z.boolean().optional(),
  }).optional(),
  licenseId: z.uuid().nullable().optional(),
  notes: z.string().optional(),
  equipped: z.boolean().optional(),
  stashed: z.boolean().optional(),
  fixed: z.boolean().optional(),
  wireless: z.object({
    enabled: z.boolean().optional(),
    removed: z.boolean().optional(),
  }).optional(),
  _state: z.object({
    equipOnUnstash: z.boolean().optional(),
  }).optional(),
  items: z.object({
    parentId: z.uuid().nullable(),
    childIds: z.uuid().array(),
  }),
}) satisfies z.ZodType<SinData>
