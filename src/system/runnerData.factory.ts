import { getAttributesValues } from "#/components/runner/attributes/getAttributesValues.ts"
import { CURRENT_RUNNER_VERSION } from "#/data/migrations.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

import { awakenings, AwakeningType } from "./awakeningType.ts"
import { EntityKind } from "./entityKind.ts"
import type { ItemCatalog } from "./items/itemUtils.ts"
import { LifestyleType } from "./lifestyleType.ts"
import { metatypes, MetatypeType } from "./metatypeData.ts"
import type { RunnerData } from "./runnerData.ts"

export type RunnerFactoryOverrideFn = (data: RunnerData & { gear: ItemCatalog }) => RunnerData

/** @deprecated use runnerDataFactory({ override: () => {}}) instead */
export function runnerDataFactory(overrideFn: RunnerFactoryOverrideFn): RunnerData
export function runnerDataFactory(options?: {
  items?: ItemCatalog
  override?: RunnerFactoryOverrideFn
}): RunnerData
export function runnerDataFactory(
  optionsOrOverride?:
    | RunnerFactoryOverrideFn
    | { items?: ItemCatalog, override?: RunnerFactoryOverrideFn },
): RunnerData {
  const overrideFn = typeof optionsOrOverride === "function" ? optionsOrOverride : optionsOrOverride?.override
  const items = typeof optionsOrOverride === "object" ? optionsOrOverride.items : undefined

  const data = {
    kind: EntityKind.runner,
    id: NullUuid,
    _meta_: { version: CURRENT_RUNNER_VERSION, lastExportDate: null },

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

    _data_: {
      featureFlags: {},
      items: items ?? {},
    },

    get gear(): ItemCatalog {
      return data._data_.items
    },

    set gear(value: ItemCatalog) {
      data._data_.items = value
    },
  } satisfies RunnerData & { gear: ItemCatalog }

  if (overrideFn) {
    return overrideFn(data)
  } else {
    return data
  }
}
