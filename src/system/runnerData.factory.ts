import { produce } from "immer"

import { getAttributesValues } from "#/components/runner/attributes/getAttributesValues.ts"
import { LATEST_MIGRATION_TIMESTAMP } from "#/data/migrations.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

import { awakenings, AwakeningType } from "./awakeningType.ts"
import { EntityKind } from "./entityKind.ts"
import type { ItemCatalog } from "./items/itemUtils.ts"
import { LifestyleType } from "./lifestyleType.ts"
import { metatypes, MetatypeType } from "./metatypeData.ts"
import type { RunnerData } from "./runnerData.ts"

export type RunnerFactoryAfterBuildFn = (runner: RunnerData) => void

export function runnerDataFactory(options?: {
  items?: ItemCatalog
  afterBuild?: RunnerFactoryAfterBuildFn
}): RunnerData {
  const afterBuild = options?.afterBuild
  const items = options?.items

  const data: RunnerData = {
    kind: EntityKind.runner,
    id: NullUuid,
    name: "",
    _meta_: { appVersion: LATEST_MIGRATION_TIMESTAMP, lastExportDate: null },

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
      gender: null,
      age: null,
      weight: null,
      height: null,
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

    gameState: {
      matrix: {
        knownNodes: [],
        activePrograms: [],
      },
    },

    skills: {
      activeSkills: [],
      skillGroups: [],
      knowledgeSkills: [],
      languageSkills: [],
    },

    initiative: {
      passesCompleted: [],
    },

    tradition: null,

    spells: [],
    spirits: [],
    powers: [],
    complexForms: [],
    sprites: [],
    contacts: [],

    initiateGrade: 0,
    submersionGrade: 0,

    karma: {
      total: 0,
      current: 0,
      log: [],
    },

    nuyen: {
      current: 0,
      loans: [],
    },

    items: { parentId: null, childIds: [] },

    _data_: {
      featureFlags: {},
      items: items ?? {},
    },
  }

  if (!afterBuild) {
    return data
  }

  return produce(data, (draft) => {
    afterBuild(draft as RunnerData)
  })
}
