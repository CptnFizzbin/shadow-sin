import { z } from "zod"

import { AwakeningType } from "./awakeningType.ts"
import type { EntityBase } from "./entities/entityTraits.ts"
import { EntityKind } from "./entityKind.ts"
import type { FeatureFlagsData } from "./featureFlags/featureFlagsData.ts"
import type { ItemCatalog } from "./items/itemUtils.ts"
import { MetatypeType } from "./metatypeData.ts"

export interface RunnerBase extends EntityBase {
  kind: EntityKind.runner
}

export interface RunnerWithData extends RunnerBase {
  _data_: {
    /**
     * Per-runner feature flags. Optional so pre-migration runners remain
     * structurally valid; the migration backfills this on next load.
     */
    featureFlags: FeatureFlagsData

    items: ItemCatalog
  }
}

export interface RunnerWithBiology extends RunnerBase {
  biology: {
    metatype: MetatypeType
    awakening: AwakeningType
    gender: null | string
    age: null | number
    weight: null | string
    height: null | string
  }
}

export function isRunnerWithBiology(obj: object): obj is RunnerWithBiology {
  return z.object({
    kind: z.literal(EntityKind.runner),
    biology: z.object({
      metatype: z.enum(MetatypeType),
      awakening: z.enum(AwakeningType),
    }),
  }).safeParse(obj).success
}

/**
 * The runner's item catalog (`RunnerData._data_.items`). `_data_` is generalized internal
 * storage — sibling to `_meta_` — and isn't meant to be reached into directly; call sites that
 * want the item catalog go through this instead.
 */
export function getItemCatalog(runner: RunnerWithData): ItemCatalog {
  return runner._data_.items
}
