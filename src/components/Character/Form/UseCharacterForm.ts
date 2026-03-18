import {
  type AttributeBuildState,
  getAttrBuildState,
} from "#/components/Character/Form/AttributeBuildState.ts"
import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import { AwakeningType, awakenings } from "#/lib/system/types/awakeningType.ts"
import { LifestyleType } from "#/lib/system/types/LifestyleType.ts"
import { MetatypeKey, metatypes } from "#/lib/system/types/MetatypeData.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"

export interface SinFormItem {
  id: string
  name: string
  rating: number
  kind: "real" | "fake"
}

export interface LicenseFormItem {
  id: string
  name: string
  rating: number
  sinId: string
}

export interface CharacterFormState {
  buildPoints: {
    total: number
    spent: {
      metatype: number
      qualities: number
      attributes: number
      skills: number
      gear: number
    }
  }

  name: string
  alias: string
  lifestyle: LifestyleType
  gender?: string
  weight?: string
  height?: string
  age: number
  metatype: MetatypeKey
  awakening: AwakeningType

  attributes: {
    body: AttributeBuildState
    agility: AttributeBuildState
    reaction: AttributeBuildState
    strength: AttributeBuildState
    charisma: AttributeBuildState
    intuition: AttributeBuildState
    logic: AttributeBuildState
    willpower: AttributeBuildState
    edge: AttributeBuildState
    magic: AttributeBuildState
    resonance: AttributeBuildState
  }

  gear: {
    maxAvailability: number
    sins: SinFormItem[]
    licenses: LicenseFormItem[]
  }
}

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
      body: getAttrBuildState({
        attr: AttributeKey.body,
        character,
        metatype,
        awakening,
      }),
      agility: getAttrBuildState({
        attr: AttributeKey.agility,
        character,
        metatype,
        awakening,
      }),
      reaction: getAttrBuildState({
        attr: AttributeKey.reaction,
        character,
        metatype,
        awakening,
      }),
      strength: getAttrBuildState({
        attr: AttributeKey.strength,
        character,
        metatype,
        awakening,
      }),
      charisma: getAttrBuildState({
        attr: AttributeKey.charisma,
        character,
        metatype,
        awakening,
      }),
      intuition: getAttrBuildState({
        attr: AttributeKey.intuition,
        character,
        metatype,
        awakening,
      }),
      logic: getAttrBuildState({
        attr: AttributeKey.logic,
        character,
        metatype,
        awakening,
      }),
      willpower: getAttrBuildState({
        attr: AttributeKey.willpower,
        character,
        metatype,
        awakening,
      }),
      edge: getAttrBuildState({
        attr: AttributeKey.edge,
        character,
        metatype,
        awakening,
      }),
      magic: getAttrBuildState({
        attr: AttributeKey.magic,
        character,
        metatype,
        awakening,
      }),
      resonance: getAttrBuildState({
        attr: AttributeKey.resonance,
        character,
        metatype,
        awakening,
      }),
    },

    gear: {
      maxAvailability: 12,
      sins: [],
      licenses: [],
    },
  }

  return useAppForm({ defaultValues })
}

export type PlayerCharacterForm = ReturnType<typeof useCharacterForm>
