import { z } from "zod"

import { AttributeKey } from "#/lib/system/attributeKey.ts"

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

export const drainAttributeSelectOptions = [
  { label: "Body (BOD)", value: AttributeKey.body },
  { label: "Agility (AGI)", value: AttributeKey.agility },
  { label: "Reaction (REA)", value: AttributeKey.reaction },
  { label: "Strength (STR)", value: AttributeKey.strength },
  { label: "Charisma (CHA)", value: AttributeKey.charisma },
  { label: "Intuition (INT)", value: AttributeKey.intuition },
  { label: "Logic (LOG)", value: AttributeKey.logic },
  { label: "Willpower (WIL)", value: AttributeKey.willpower },
]
