import { z } from "zod"

import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectDataSchema } from "#/system/gameEffects/gameEffectData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

interface SinDataBase extends ItemData {
  itemType: ItemType.sin
}

/**
 * A held identity. `isReal: true` is a Real SIN — issued by a government, never rolled, always
 * clears a License Check — while `isReal: false` is a fake SIN carrying a forgery-quality
 * `rating`. See CONTEXT.md's **SIN** glossary entry.
 */
export type SinData =
  | (SinDataBase & { isReal: true })
  | (SinDataBase & { isReal: false, rating: number })

export function isSinData(item: ItemData): item is SinData {
  return item.itemType === ItemType.sin
}

/**
 * Private, file-local base carrying the ~15 shared `ItemData`/`EntityData` fields — extended by
 * each `SinDataSchema` union branch below so they aren't duplicated twice in this file. Scoped to
 * this file only; not a codebase-wide schema-composition pattern (see AGENTS.md).
 */
const sinDataBaseSchema = z.object({
  kind: z.literal(EntityKind.item),
  id: z.uuid(),
  itemType: z.literal(ItemType.sin),
  name: z.string().min(1, "Name is required"),
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
})

export const SinDataSchema = z.discriminatedUnion("isReal", [
  sinDataBaseSchema.extend({ isReal: z.literal(true) }).strict(),
  sinDataBaseSchema.extend({ isReal: z.literal(false), rating: z.number().int().min(1) }).strict(),
]) satisfies z.ZodType<SinData>
