import { AttributeKey } from "#/system/attributeKey.ts"
import { attrAugmentedMax, attrMin, attrNaturalMax } from "#/system/attributes/attributeCatalog.ts"
import type { AwakeningData } from "#/system/awakeningType.ts"
import type { MetatypeData } from "#/system/metatypeData.ts"

interface AttributeInfo {
  attr: AttributeKey
  value: number
  min: number
  max: number
  augMax: number
}

interface AttributeInfoOptions {
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
      attrState.min = attrMin(awakening.attributes, attr)
      attrState.max = attrNaturalMax(awakening.attributes, attr)
      attrState.augMax = attrAugmentedMax(awakening.attributes, attr)
      break
    default:
      attrState.min = attrMin(metatype.attributes, attr)
      attrState.max = attrNaturalMax(metatype.attributes, attr)
      attrState.augMax = attrAugmentedMax(metatype.attributes, attr)
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

function clampValue(min: number, value: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}
