import { migrationIds } from "#/character/migrations.ts"
import { getAttributesValues } from "#/components/character/attributes/getAttributesValues.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { awakenings, AwakeningType } from "#/system/awakeningType.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import { LifestyleType } from "#/system/lifestyleType.ts"
import { metatypes, MetatypeType } from "#/system/metatypeData.ts"

export const createDefaultCharacterSheet = (): CharacterSheet => ({
  id: NullUuid,
  _meta_: { version: 1, appliedMigrations: [...migrationIds] },

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
  spirits: [],
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
