import type { UUID } from "node:crypto"

import { z } from "zod"

import { GameEffectDataSchema } from "#/system/gameEffects/gameEffectData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { Rating } from "#/system/rating.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

export enum ArmorRatingType {
  ballistic = "ballistic",
  impact = "impact",
}

export interface ArmorRating {
  [ArmorRatingType.ballistic]: Rating
  [ArmorRatingType.impact]: Rating
}

export interface ArmorData extends ItemData, ArmorRating {
  itemType: ItemType.armor

  damage?: {
    ballistic: number
    impact: number
  }
  /**
   * Base armor doesn't stack — only the highest-rated base armor applies.
   * Modifier armor (e.g. helmets, shields) stacks additively on top of the base.
   */
  isModifier?: boolean
}

// Not yet wired into a form validator (see SpellDataSchema/AdeptPowerDataSchema for the pattern) — kept for parity with sibling item-data schemas
// fallow-ignore-next-line unused-export
export const ArmorDataSchema = z.object({
  id: z.uuid() as z.ZodType<UUID>,
  name: z.string(),
  itemType: z.literal(ItemType.armor),

  description: z.string().optional(),
  cost: z.number().optional(),
  quantity: z.number().int().min(0).optional(),
  availability: z.object({
    rating: z.number().int().min(0),
    restricted: z.boolean().optional(),
    forbidden: z.boolean().optional(),
  }).optional(),
  source: SourceDataSchema.optional(),

  parentId: (z.uuid() as z.ZodType<UUID>).optional(),
  childIds: z.array(z.uuid() as z.ZodType<UUID>).optional(),

  notes: z.string().optional(),
  equipped: z.boolean().optional(),
  stashed: z.boolean().optional(),
  fixed: z.boolean().optional(),

  _state: z.object({
    equipOnUnstash: z.boolean().optional(),
  }).optional(),

  wireless: z.object({
    enabled: z.boolean().optional(),
    removed: z.boolean().optional(),
  }).optional(),

  effects: z.array(GameEffectDataSchema).optional(),

  ballistic: z.number().int().min(0),
  impact: z.number().int().min(0),
  damage: z.object({
    ballistic: z.number().int().min(0),
    impact: z.number().int().min(0),
  }).optional(),
  isModifier: z.boolean().optional(),
}) satisfies z.ZodType<ArmorData>

export function isArmorData(item: ItemData): item is ArmorData {
  return item.itemType === ItemType.armor
}
