import type { MetatypeData } from "#/lib/system/types/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import type { AwakeningData } from "#/lib/system/types/awakeningType.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"


export interface AttrFormState {
  min: number
  max: number
  augMax?: number
  value: number
}

export function createAttrFormState({
  attr,
  metatype,
  awakening,
  character,
  value,
}: {
  attr: AttributeKey
  metatype: MetatypeData
  awakening: AwakeningData
  character?: PlayerCharacterData
  value?: number
}): AttrFormState {
  const state: AttrFormState = {
    min: 0,
    max: 0,
    augMax: 0,
    value: 0,
  }

  if (attr === AttributeKey.resonance || attr === AttributeKey.magic) {
    state.min = awakening.attributes[attr].min
    state.max = awakening.attributes[attr].max
    state.value = value || character?.attributes[attr] || state.min
  } else {
    state.min = metatype.attributes[attr].min
    state.max = metatype.attributes[attr].max
    state.augMax = metatype.attributes[attr].augMax
    state.value = value || character?.attributes[attr] || state.min
  }

  return state
}
