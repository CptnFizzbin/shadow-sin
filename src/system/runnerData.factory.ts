import { getAttributesValues } from "#/components/runner/attributes/getAttributesValues.ts"
import { CURRENT_RUNNER_VERSION } from "#/data/migrations.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

import { awakenings, AwakeningType } from "./awakeningType.ts"
import { EntityKind } from "./entityKind.ts"
import type { ItemCatalog } from "./items/itemUtils.ts"
import { LifestyleType } from "./lifestyleType.ts"
import { metatypes, MetatypeType } from "./metatypeData.ts"
import type { RunnerData } from "./runnerData.ts"
import { getItemCatalog } from "./runnerTraits.ts"

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

  const data: RunnerData = {
    kind: EntityKind.runner,
    id: NullUuid,
    name: "",
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

    items: { parentId: null, childIds: [] },

    _data_: {
      featureFlags: {},
      items: items ?? {},
    },
  }

  // Back-compat for override functions still written against the pre-Slice-5 `data.gear` field
  // name (see RunnerFactoryOverrideFn's @deprecated note) — a getter/setter keeps `data.gear` and
  // `data._data_.items` in sync for direct mutation (`data.gear = {...}`). It's non-enumerable so
  // it doesn't leak into `{ ...data }`-style overrides or show up as an unexpected key when this
  // data becomes a Redux store's preloadedState.
  Object.defineProperty(data, "gear", {
    configurable: true,
    get(this: RunnerData) {
      return getItemCatalog(this)
    },
    set(this: RunnerData, value: ItemCatalog) {
      this._data_.items = value
    },
  })

  if (!overrideFn) {
    return data
  }

  const result = overrideFn(data as RunnerData & { gear: ItemCatalog })

  // A spread-style override (`{ ...data, gear: {...} }`) produces a *new* object that doesn't
  // carry the getter/setter above, leaving its explicit `gear` value disconnected from
  // `_data_.items` — reconcile it back before handing the result off.
  const resultWithGear = result as RunnerData & { gear?: ItemCatalog }
  if (Object.hasOwn(resultWithGear, "gear")) {
    resultWithGear._data_.items = resultWithGear.gear as ItemCatalog
    delete resultWithGear.gear
  }

  return result
}
