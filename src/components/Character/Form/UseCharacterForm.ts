import { createAttrFormState } from "#/components/Character/Form/AttrFormState.ts"
import type { CharacterFormState } from "#/components/Character/Form/CharacterFormState.ts"
import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import { AwakeningType, awakenings } from "#/lib/system/types/awakeningType.ts"
import { LifestyleType } from "#/lib/system/types/LifestyleType.ts"
import { MetatypeKey, metatypes } from "#/lib/system/types/MetatypeData.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"

export const useCharacterForm = (character?: PlayerCharacterData) => {
  const { profile, biology } = character || {}

  const metatype = metatypes[biology?.metatype || MetatypeKey.Human]
  const awakening = awakenings[biology?.awakening || AwakeningType.Mundane]

  const defaultValues: CharacterFormState = {
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
    gender: biology?.gender || "",
    weight: biology?.weight || "",
    height: biology?.height || "",

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

    qualities: character?.qualities ?? [],

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

  return useAppForm({ defaultValues })
}

export type PlayerCharacterForm = ReturnType<typeof useCharacterForm>
