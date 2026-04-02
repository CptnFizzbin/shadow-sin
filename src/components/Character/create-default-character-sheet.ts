import { getAttributesValues } from "#/components/Attributes/get-attributes-values.ts"
import { CurrentCharacterSheetVersion } from "#/lib/storage/characters/current-character-sheet-version.ts"
import { awakenings, AwakeningType } from "#/lib/system/awakening-type.ts"
import type { CharacterSheet } from "#/lib/system/character-sheet.ts"
import { LifestyleType } from "#/lib/system/lifestyle-type.ts"
import { metatypes, MetatypeType } from "#/lib/system/metatype-data.ts"

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
      monthsPaid: 1,
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

  attributes: getAttributesValues(metatypes[MetatypeType.Human], awakenings[AwakeningType.Mundane]),

  edge: {
    current: 0,
  },

  damage: {
    physical: 0,
    stun: 0,
    matrix: 0,
  },

  skills: {
    activeSkills: [],
    skillGroups: [],
    knowledgeSkills: [],
    languageSkills: [],
  },

  spells: [],
  adeptPowers: [],
  complexForms: [],
  sprites: [],
  contacts: [],

  gear: {},

  karma: {
    total: 0,
    current: 0,
  },

  nuyen: {
    current: 0,
    loans: [],
  },
})
