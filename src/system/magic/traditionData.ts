import { z } from "zod"

import { AttributeKey, AttributeLabels, MentalAttributes, PhysicalAttributes } from "#/system/attributeKey.ts"
import { SpiritType, SpiritTypeLabels } from "#/system/magic/spiritData.ts"

export { SpiritType, SpiritTypeLabels }

export const spiritTypeSelectOptions = Object.values(SpiritType).map((spiritType) => ({
  value: spiritType,
  label: SpiritTypeLabels[spiritType],
}))

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
    combat: z.enum(SpiritType, { message: "Combat spirit type is required" }),
    detection: z.enum(SpiritType, { message: "Detection spirit type is required" }),
    health: z.enum(SpiritType, { message: "Health spirit type is required" }),
    illusion: z.enum(SpiritType, { message: "Illusion spirit type is required" }),
    manipulation: z.enum(SpiritType, { message: "Manipulation spirit type is required" }),
  }),
  drainAttribute: z.enum(AttributeKey),
  concept: z.string().optional(),
}) satisfies z.ZodType<TraditionData>

export const drainAttributeSelectOptions = [...PhysicalAttributes, ...MentalAttributes].map(
  (key) => ({ value: key, label: AttributeLabels[key] }),
)
