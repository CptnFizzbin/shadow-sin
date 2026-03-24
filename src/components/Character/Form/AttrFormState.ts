import type { MetatypeData } from "#/lib/system/types/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import type { AwakeningData } from "#/lib/system/types/awakeningType.ts"
import type { CharacterSheet } from "#/lib/system/types/playerCharacterData.ts"

/**
 * The min/max constraints for a single attribute, derived from the character's
 * metatype and awakening type. Stored separately from the attribute value so
 * that CharacterFormState can use `Record<AttributeKey, number>` for attribute
 * values (matching CharacterSheet) while still tracking limits for the
 * character builder UI.
 */
export interface AttrLimits {
  min: number
  max: number
  augMax?: number
}

/**
 * Combined attribute limits and value, used as an intermediate computation
 * result. The `value` field is stored directly on `CharacterFormState.attributes`
 * (as a plain number) while the limits are stored on `CharacterFormState.attributeLimits`.
 */
export interface AttrFormState extends AttrLimits {
  value: number
}

export function createAttrLimits({
  attr,
  metatype,
  awakening,
}: {
  attr: AttributeKey
  metatype: MetatypeData
  awakening: AwakeningData
}): AttrLimits {
  if (attr === AttributeKey.resonance || attr === AttributeKey.magic) {
    return {
      min: awakening.attributes[attr].min,
      max: awakening.attributes[attr].max,
    }
  }

  return {
    min: metatype.attributes[attr].min,
    max: metatype.attributes[attr].max,
    augMax: metatype.attributes[attr].augMax,
  }
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
  character?: CharacterSheet
  value?: number
}): AttrFormState {
  const limits = createAttrLimits({ attr, metatype, awakening })
  const attrValue = value ?? character?.attributes[attr] ?? limits.min

  return { ...limits, value: attrValue }
}
