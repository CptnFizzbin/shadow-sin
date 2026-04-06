import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { AwakeningData } from "#/lib/system/awakeningType.ts"
import type { MetatypeData } from "#/lib/system/metatypeData.ts"

export interface AttributeInfo {
  attr: AttributeKey
  value: number
  min: number
  max: number
  augMax: number
}

export interface AttributeInfoOptions {
  attr: AttributeKey
  value?: number
  metatype: MetatypeData
  awakening: AwakeningData
}

export const createAttrInfo = ({
  attr,
  value = 0,
  metatype,
  awakening,
}: AttributeInfoOptions): AttributeInfo => {
  if (attr === AttributeKey.essence) {
    return { attr, value: 6, min: 0, max: 6, augMax: 6 }
  }

  const attrState = {
    attr: attr,
    value: value,
    min: 0,
    max: 0,
    augMax: 0,
  }

  switch (attr) {
    case AttributeKey.magic:
    case AttributeKey.resonance:
      attrState.min = awakening.attributes[attr].min
      attrState.max = awakening.attributes[attr].max
      attrState.augMax = awakening.attributes[attr].max
      break
    default:
      attrState.min = metatype.attributes[attr].min
      attrState.max = metatype.attributes[attr].max
      attrState.augMax =
        metatype.attributes[attr].augMax
        || metatype.attributes[attr].max
      break
  }

  return {
    ...attrState,
    value: clampValue(
      attrState.min,
      value,
      attrState.max,
    ),
  }
}

export function clampValue(min: number, value: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}
