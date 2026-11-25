import type { AttributeKey } from "./attributeKey.ts"

export interface AttributeInfo {
  attr: AttributeKey
  min: number
  max: number
  augMax?: number
  value?: number
  baseValue?: number
  computed?: boolean
}

export interface EntityAttributeInfo extends AttributeInfo {
  base: number
  value: number

  /** @deprecated */
  baseValue: number

  /** @deprecated */
  current: number
}
