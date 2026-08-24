import { z } from "zod"

import { AttributeKey } from "#/system/attributeKey.ts"

import { SpiritType } from "./spiritData.ts"

export { SpiritType }

export interface TraditionSpiritTypes {
  combat: SpiritType
  detection: SpiritType
  health: SpiritType
  illusion: SpiritType
  manipulation: SpiritType
}

export interface TraditionData {
  name: string
  spiritTypes: TraditionSpiritTypes
  drainAttribute: AttributeKey
  concept?: string
}

export const TraditionDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  spiritTypes: z.object({
    combat: z.enum(SpiritType, { error: "Combat spirit type is required" }),
    detection: z.enum(SpiritType, { error: "Detection spirit type is required" }),
    health: z.enum(SpiritType, { error: "Health spirit type is required" }),
    illusion: z.enum(SpiritType, { error: "Illusion spirit type is required" }),
    manipulation: z.enum(SpiritType, { error: "Manipulation spirit type is required" }),
  }),
  drainAttribute: z.enum(AttributeKey),
  concept: z.string().optional(),
}) satisfies z.ZodType<TraditionData>
