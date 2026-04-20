import { z } from "zod"

import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

export enum ProgramType {
  attack = "attack",
  browse = "browse",
  command = "command",
  dataSearch = "dataSearch",
  decrypt = "decrypt",
  eccm = "eccm",
  edit = "edit",
  encrypt = "encrypt",
  exploit = "exploit",
  medic = "medic",
  scan = "scan",
  spoof = "spoof",
  stealth = "stealth",
  track = "track",
  other = "other",
}

export interface ProgramData extends ItemData {
  itemType: ItemType.program
  rating: number
  programType: ProgramType
}

export function isProgramData(item: ItemData): item is ProgramData {
  return item.itemType === ItemType.program
}

export const ProgramTypeSchema = z.enum(ProgramType)

export const ProgramDataSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  itemType: z.literal(ItemType.program),
  rating: z.number(),
  programType: ProgramTypeSchema,

  description: z.string().optional(),
  cost: z.number().optional(),
  quantity: z.number().optional(),
  availability: z
    .object({ rating: z.number(), restricted: z.boolean().optional(), forbidden: z.boolean().optional() })
    .optional(),
  source: z.object({ book: z.string(), page: z.number() }).optional(),
  effects: z.array(z.any()).optional(),
  parentId: z.string().optional(),
  childIds: z.array(z.string()).optional(),
})
