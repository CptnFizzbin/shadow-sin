import { createAttrFormState } from "#/components/Character/Form/AttrFormState.ts"
import type { CharacterFormState } from "#/components/Character/Form/CharacterFormState.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import { AwakeningType, awakenings } from "#/lib/system/types/awakeningType.ts"
import { LifestyleType } from "#/lib/system/types/LifestyleType.ts"
import { MetatypeKey, metatypes } from "#/lib/system/types/MetatypeData.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"

export const NULL_CHARACTER_ID = "00000000-0000-0000-0000-000000000000"

export interface UseDefaultValuesOptions {
  character?: PlayerCharacterData
}

export const useDefaultValues = ({
  character,
}: UseDefaultValuesOptions): CharacterFormState => {
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
        gear: 0,
      },
    },

    name: profile?.name || "",
    alias: profile?.alias || "",
    lifestyle: profile?.lifestyle?.quality || LifestyleType.Low,

    age: biology?.age || 0,
    metatype: metatype.name,
    awakening: biology?.awakening || AwakeningType.Mundane,

    attributes: {
      body: createAttrFormState({
        attr: AttributeKey.body,
        character,
        metatype,
        awakening,
      }),
      agility: createAttrFormState({
        attr: AttributeKey.agility,
        character,
        metatype,
        awakening,
      }),
      reaction: createAttrFormState({
        attr: AttributeKey.reaction,
        character,
        metatype,
        awakening,
      }),
      strength: createAttrFormState({
        attr: AttributeKey.strength,
        character,
        metatype,
        awakening,
      }),
      charisma: createAttrFormState({
        attr: AttributeKey.charisma,
        character,
        metatype,
        awakening,
      }),
      intuition: createAttrFormState({
        attr: AttributeKey.intuition,
        character,
        metatype,
        awakening,
      }),
      logic: createAttrFormState({
        attr: AttributeKey.logic,
        character,
        metatype,
        awakening,
      }),
      willpower: createAttrFormState({
        attr: AttributeKey.willpower,
        character,
        metatype,
        awakening,
      }),
      edge: createAttrFormState({
        attr: AttributeKey.edge,
        character,
        metatype,
        awakening,
      }),
      magic: createAttrFormState({
        attr: AttributeKey.magic,
        character,
        metatype,
        awakening,
      }),
      resonance: createAttrFormState({
        attr: AttributeKey.resonance,
        character,
        metatype,
        awakening,
      }),
    },

    qualities: [],

    gear: {
      sins: [],
      licenses: [],
      weapons: [],
      armor: [],
      vehicles: [],
      cyberware: [],
      misc: [],
    },
  }
}
