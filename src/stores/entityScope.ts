import type { EntityData } from "#/system/entityData.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"

export interface EntityScope {
  runner: RunnerData
  entity: EntityData
  items: ItemCatalog
}

export const getRunnerScope = (runner: RunnerData): EntityScope => {
  return {
    runner: runner,
    entity: runner,
    items: getItemCatalog(runner),
  }
}

export const getEntityScope = (runner: RunnerData, entity: EntityData): EntityScope => {
  return {
    ...getRunnerScope(runner),
    entity: entity,
  }
}
