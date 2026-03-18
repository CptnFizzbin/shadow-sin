import { MetatypeKey, metatypes } from "#/lib/system/types/MetatypeData.ts"
import { awakenings, AwakeningType } from "#/lib/system/types/awakeningType.ts"
import { LifestyleType } from "#/lib/system/types/LifestyleType.ts"
import { getAttributeFormState } from "#/components/Character/Form/AttributeBuildState.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import { NULL_CHARACTER_ID } from "#/components/Character/Form/UseCharacterForm.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"
import type { CharacterFormState } from "#/components/Character/Form/CharacterFormState.ts"

export interface UseDefaultValuesOptions {
  character?: PlayerCharacterData
}

export const useDefaultValues = ({ character }: UseDefaultValuesOptions): CharacterFormState => {
  const characterId = character?.id ?? NULL_CHARACTER_ID
  const { profile, biology } = character || {}

  const metatype = metatypes[biology?.metatype || MetatypeKey.Human]
  const awakening = awakenings[biology?.awakening || AwakeningType.Mundane]

  return {
    characterId: characterId,

    buildPoints: {
      total: 400,
      spent: {
        metatype: 0,
        qualities: 0,
        attributes: 0,
        skills: 0,
        gear: 0
      }
    },

    name: profile?.name || "",
    alias: profile?.alias || "",
    lifestyle: profile?.lifestyle?.quality || LifestyleType.Low,

    age: biology?.age || 0,
    metatype: metatype.name,
    awakening: biology?.awakening || AwakeningType.Mundane,

    attributes: {
      body: getAttributeFormState({
        attr: AttributeKey.body,
        character,
        metatype,
        awakening
      }),
      agility: getAttributeFormState({
        attr: AttributeKey.agility,
        character,
        metatype,
        awakening
      }),
      reaction: getAttributeFormState({
        attr: AttributeKey.reaction,
        character,
        metatype,
        awakening
      }),
      strength: getAttributeFormState({
        attr: AttributeKey.strength,
        character,
        metatype,
        awakening
      }),
      charisma: getAttributeFormState({
        attr: AttributeKey.charisma,
        character,
        metatype,
        awakening
      }),
      intuition: getAttributeFormState({
        attr: AttributeKey.intuition,
        character,
        metatype,
        awakening
      }),
      logic: getAttributeFormState({
        attr: AttributeKey.logic,
        character,
        metatype,
        awakening
      }),
      willpower: getAttributeFormState({
        attr: AttributeKey.willpower,
        character,
        metatype,
        awakening
      }),
      edge: getAttributeFormState({
        attr: AttributeKey.edge,
        character,
        metatype,
        awakening
      }),
      magic: getAttributeFormState({
        attr: AttributeKey.magic,
        character,
        metatype,
        awakening
      }),
      resonance: getAttributeFormState({
        attr: AttributeKey.resonance,
        character,
        metatype,
        awakening
      })
    }
  }
}
