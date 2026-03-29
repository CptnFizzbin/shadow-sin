import { CurrentCharacterSheetVersion } from "#/lib/storage/characters/CurrentCharacterSheetVersion.ts"
import { LifestyleType } from "#/lib/system/LifestyleType.ts"
import { MetatypeType } from "#/lib/system/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export const NULL_CHARACTER_ID = "00000000-0000-0000-0000-000000000000"

export const createDefaultCharacterSheet = (): CharacterSheet => ({
  id: NULL_CHARACTER_ID,
  version: CurrentCharacterSheetVersion,

  profile: {
    alias: "",
    name: "",
    archetype: "",
    streetCred: 0,
    notoriety: 0,
    description: "",
    personality: "",
    lifestyle: {
      quality: LifestyleType.Middle,
      monthsPaid: 0,
    },
  },

  biology: {
    metatype: MetatypeType.Human,
    awakening: AwakeningType.Mundane,
    gender: undefined,
    age: undefined,
    weight: undefined,
    height: undefined,
  },

  qualities: [],

  attributes: {
    [AttributeKey.body]: 1,
    [AttributeKey.agility]: 1,
    [AttributeKey.reaction]: 1,
    [AttributeKey.strength]: 1,
    [AttributeKey.charisma]: 1,
    [AttributeKey.intuition]: 1,
    [AttributeKey.logic]: 1,
    [AttributeKey.willpower]: 1,
    [AttributeKey.edge]: 1,
    [AttributeKey.essence]: 6,
    [AttributeKey.magic]: 0,
    [AttributeKey.resonance]: 0,
  },

  edge: {
    current: 0,
  },

  damage: {
    physical: 0,
    stun: 0,
    matrix: 0,
  },

  skills: {},

  spells: [],
  adeptPowers: [],

  gear: {},
  contacts: [],

  karma: {
    total: 0,
    current: 0,
  },

  nuyen: {
    current: 0,
    loans: [],
  },
})
