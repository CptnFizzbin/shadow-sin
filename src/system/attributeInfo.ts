export interface AttributeInfo {
  min: number
  max: number
  augMax?: number
  value?: number
  baseValue?: number
  computed?: boolean
}

export interface EntityAttributeInfo extends AttributeInfo {
  base: number
  current: number
}
