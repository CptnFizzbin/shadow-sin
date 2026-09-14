import type { EntityData } from "#/system/model/entities/entityData.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"

export interface EntityScope {
  runner: RunnerData
  entity: EntityData
  items: ItemCatalog
}

export const getEntityScope = (runner: RunnerData, entity: EntityData): EntityScope => {
  return {
    runner: runner,
    entity: entity,
    items: getItemCatalog(runner),
  }
}

export const getRunnerScope = (runner: RunnerData): EntityScope => {
  return getEntityScope(runner, runner)
}
