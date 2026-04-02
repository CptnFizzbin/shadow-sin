import { z } from "zod"

import { AttributeKey, AttributeLabels, MentalAttributes, PhysicalAttributes } from "#/lib/system/attributeKey.ts"

export interface TraditionSpiritTypes {
  combat: string
  detection: string
  health: string
  illusion: string
  manipulation: string
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
    combat: z.string().min(1, "Combat spirit type is required"),
    detection: z.string().min(1, "Detection spirit type is required"),
    health: z.string().min(1, "Health spirit type is required"),
    illusion: z.string().min(1, "Illusion spirit type is required"),
    manipulation: z.string().min(1, "Manipulation spirit type is required"),
  }),
  drainAttribute: z.nativeEnum(AttributeKey),
  concept: z.string().optional(),
}) satisfies z.ZodType<TraditionData>

export const drainAttributeSelectOptions = [...PhysicalAttributes, ...MentalAttributes].map(
  (key) => ({ value: key, label: AttributeLabels[key] }),
)
