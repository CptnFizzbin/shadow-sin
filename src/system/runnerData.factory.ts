import { getAttributesValues } from "#/components/runner/attributes/getAttributesValues.ts"
import { migrationIds } from "#/data/migrations.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

import { awakenings, AwakeningType } from "./awakeningType.ts"
import { LifestyleType } from "./lifestyleType.ts"
import { metatypes, MetatypeType } from "./metatypeData.ts"
import type { RunnerData } from "./runnerData.ts"

export const runnerDataFactory = (overrideFn?: (data: RunnerData) => RunnerData): RunnerData => {
  const data = {
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
    powers: [],
    complexForms: [],
    sprites: [],
    contacts: [],

    gear: {},

    karma: {
      total: 0,
      current: 0,
      log: [],
    },

    nuyen: {
      current: 0,
      loans: [],
    },

    featureFlags: {},
  } satisfies RunnerData

  if (overrideFn) {
    return overrideFn(data)
  } else {
    return data
  }
}
