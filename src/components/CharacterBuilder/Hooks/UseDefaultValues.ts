import { NULL_CHARACTER_ID } from "#/components/Character/CreateDefaultCharacterSheet.ts"
import type { CharacterBuilderState } from "#/components/CharacterBuilder/CharacterBuilderState.ts"
import { createAttrFormState } from "#/components/CharacterBuilder/Sections/Attributes/AttrFormState.ts"
import { LifestyleType } from "#/lib/system/LifestyleType.ts"
import { metatypes, MetatypeType } from "#/lib/system/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { awakenings, AwakeningType } from "#/lib/system/awakeningType.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export interface UseDefaultValuesOptions {
  character?: CharacterSheet
}

export const useDefaultValues = ({
  character,
}: UseDefaultValuesOptions): CharacterBuilderState => {
  const characterId = character?.id ?? NULL_CHARACTER_ID
  const { profile, biology } = character || {}

  const metatype = metatypes[biology?.metatype || MetatypeType.Human]
  const awakening = awakenings[biology?.awakening || AwakeningType.Mundane]

  return {
    characterId: characterId,

    name: profile?.name || "",
    alias: profile?.alias || "",
    lifestyle: profile?.lifestyle?.quality || LifestyleType.Low,
    lifestyleMonths: 1,

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
      essence: createAttrFormState({
        attr: AttributeKey.essence,
        character,
        metatype,
        awakening,
      }),
    },

    qualities: [],

    skills: {
      activeSkills: [],
      activeSkillGroups: [],
      knowledgeSkills: [],
      languageSkills: [],
    },

    awakened: {
      complexForms: [],
      sprites: [],
      spells: [],
      adeptPowers: [],
    },

    gear: {},

    contacts: [],
  }
}
