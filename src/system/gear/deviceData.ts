import { z } from "zod"

import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

export interface DeviceData extends ItemData {
  itemType: ItemType.device

  deviceType?: "commlink" | "other"
  /** Custom label shown when deviceType is "other" */
  customDeviceType?: string
  /** Brand/model name — shown when deviceType is "commlink" */
  deviceModel?: string
  deviceOS?: string

  deviceRating?: number
  response?: number
  signal?: number
  system?: number
  firewall?: number
  dataProcessing?: number
  programSlots?: number
}

export function isDeviceData(item: ItemData): item is DeviceData {
  return item.itemType === ItemType.device
}

export const DeviceDataSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  itemType: z.literal(ItemType.device),

  description: z.string().optional(),
  cost: z.number().optional(),
  quantity: z.number().optional(),
  availability: z
    .object({ rating: z.number(), restricted: z.boolean().optional(), forbidden: z.boolean().optional() })
    .optional(),
  source: z.object({ book: z.string(), page: z.number() }).optional(),
  rating: z.union([z.number(), z.string()]).optional(),

  parentId: z.string().optional(),
  childIds: z.array(z.string()).optional(),

  notes: z.string().optional(),
  equipped: z.boolean().optional(),
  fixed: z.boolean().optional(),

  wireless: z
    .object({ enabled: z.boolean().optional(), removed: z.boolean().optional() })
    .optional(),

  effects: z.array(z.any()).optional(),

  deviceRating: z.number().optional(),
  response: z.number().optional(),
  signal: z.number().optional(),
  system: z.number().optional(),
  firewall: z.number().optional(),
  dataProcessing: z.number().optional(),
  programSlots: z.number().optional(),
  deviceType: z.enum(["commlink", "other"]).optional(),
  customDeviceType: z.string().optional(),
  deviceModel: z.string().optional(),
  deviceOS: z.string().optional(),
})
