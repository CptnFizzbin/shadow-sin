import type { UUID } from "node:crypto"

import { z } from "zod"

import { GameEffectDataSchema } from "#/system/gameEffects/gameEffectData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { SpellCategory } from "#/system/magic/spellData.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

export enum FocusType {
  Power = "Power",
  Spellcasting = "Spellcasting",
  Summoning = "Summoning",
  Banishing = "Banishing",
  Centering = "Centering",
  Sustaining = "Sustaining",
  Weapon = "Weapon",
}

export interface FocusData extends ItemData {
  itemType: ItemType.focus
  focusType: FocusType
  /** True when Karma has been paid to link the focus. Prerequisite for activation. */
  bonded?: boolean
  /** Sustaining foci only — fixed at item creation, restricts which spell can be slotted. */
  spellCategory?: SpellCategory
  /** Sustaining foci only — the currently held spell. */
  slottedSpellId?: UUID
}

export const FocusDataSchema = z.object({
  id: z.uuid() as z.ZodType<UUID>,
  name: z.string(),
  itemType: z.literal(ItemType.focus),

  description: z.string().optional(),
  cost: z.number().optional(),
  quantity: z.number().int().min(0).optional(),
  availability: z.object({
    rating: z.number().int().min(0),
    restricted: z.boolean().optional(),
    forbidden: z.boolean().optional(),
  }).optional(),
  source: SourceDataSchema.optional(),
  rating: z.union([z.number(), z.string()]).optional(),

  parentId: (z.uuid() as z.ZodType<UUID>).optional(),
  childIds: z.array(z.uuid() as z.ZodType<UUID>).optional(),

  notes: z.string().optional(),
  equipped: z.boolean().optional(),
  fixed: z.boolean().optional(),

  wireless: z.object({
    enabled: z.boolean().optional(),
    removed: z.boolean().optional(),
  }).optional(),

  effects: z.array(GameEffectDataSchema).optional(),

  focusType: z.enum(FocusType),
  bonded: z.boolean().optional(),
  spellCategory: z.enum(SpellCategory).optional(),
  slottedSpellId: (z.uuid() as z.ZodType<UUID>).optional(),
}) satisfies z.ZodType<FocusData>

export function isFocusData(item: ItemData): item is FocusData {
  return item.itemType === ItemType.focus
}
