import type { MetatypeData } from "#/lib/system/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { AwakeningData } from "#/lib/system/awakeningType.ts"

export interface AttributeInfo {
  attr: AttributeKey
  value: number
  min: number
  max: number
  augMax: number
}

export interface AttributeInfoOptions {
  attr: AttributeKey
  value: number
  metatype: MetatypeData
  awakening: AwakeningData
}

export const createAttrInfo = ({
  attr,
  value,
  metatype,
  awakening,
}: AttributeInfoOptions): AttributeInfo => {
  if (attr === AttributeKey.essence) {
    return { attr, value, min: 0, max: 6, augMax: 6 }
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
      return attrState
    default:
      attrState.min = metatype.attributes[attr].min
      attrState.max = metatype.attributes[attr].max
      attrState.augMax =
        metatype.attributes[attr].augMax
        || metatype.attributes[attr].max
      return attrState
  }
}
