import { z } from "zod"

import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectDataSchema } from "#/system/gameEffects/gameEffectData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

/**
 * Authorizes a Restricted item, attached to a SIN (`items.parentId`). `isReal: true` is a Real
 * Licence — free, unrestricted, never rolled — matching its SIN's reality; `isReal: false` is a
 * fake Licence carrying a forgery-quality `rating`. Consumers branch on `isReal`; `rating` is
 * only meaningful (and only ever set) when `isReal` is `false`. See CONTEXT.md's **Licence**
 * glossary entry.
 */
export interface LicenseData extends ItemData {
  itemType: ItemType.license
  isReal: boolean
  rating?: number
}

export function isLicenseData(item: ItemData): item is LicenseData {
  return item.itemType === ItemType.license
}

/**
 * Zod schema for validating LicenseData.
 */
export const LicenseDataSchema = z.object({
  kind: z.literal(EntityKind.item),
  id: z.uuid(),
  itemType: z.literal(ItemType.license),
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
}) satisfies z.ZodType<LicenseData>
