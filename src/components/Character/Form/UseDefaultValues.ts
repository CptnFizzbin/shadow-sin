import { createAttrFormState } from "#/components/Character/Form/AttrFormState.ts"
import type { BuilderState } from "#/components/CharacterBuilder/BuilderState.ts"
import { CURRENT_FORM_STATE_VERSION } from "#/lib/semver.ts"
import { LifestyleType } from "#/lib/system/types/LifestyleType.ts"
import { MetatypeKey, metatypes } from "#/lib/system/types/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import { awakenings, AwakeningType } from "#/lib/system/types/awakeningType.ts"
import type { CharacterSheet } from "#/lib/system/types/playerCharacterData.ts"

export const NULL_CHARACTER_ID = "00000000-0000-0000-0000-000000000000"

export interface UseDefaultValuesOptions {
  character?: CharacterSheet
}

export const useDefaultValues = ({
  character,
}: UseDefaultValuesOptions): BuilderState => {
  const characterId = character?.id ?? NULL_CHARACTER_ID
  const { profile, biology } = character || {}

  const metatype = metatypes[biology?.metatype || MetatypeKey.Human]
  const awakening = awakenings[biology?.awakening || AwakeningType.Mundane]

  const allAttributeKeys = Object.values(AttributeKey)

  const attrEntries = allAttributeKeys.map((attr) => {
    const { value, ...limits } = createAttrFormState({
      attr,
      character,
      metatype,
      awakening,
    })
    return { attr, value, limits }
  })

  const attributes = Object.fromEntries(
    attrEntries.map(({ attr, value }) => [attr, value]),
  ) as Record<AttributeKey, number>

  const attributeLimits = Object.fromEntries(
    attrEntries.map(({ attr, limits }) => [attr, limits]),
  ) as BuilderState["attributeLimits"]

  return {
    characterId,
    version: CURRENT_FORM_STATE_VERSION,

    name: profile?.name || "",
    alias: profile?.alias || "",
    lifestyle: profile?.lifestyle?.quality || LifestyleType.Low,
    lifestyleMonths: 1,

    age: biology?.age || 0,
    metatype: metatype.name,
    awakening: biology?.awakening || AwakeningType.Mundane,

    attributes,
    qualities: [],
    contacts: [],

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

    gear: {
      sins: [],
      weapons: [],
      armor: [],
      vehicles: [],
      cyberware: [],
      devices: [],
      misc: [],
    },

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
    attributeLimits,
  }
}
