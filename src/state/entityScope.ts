import type { EntityData } from "#/data/entities/entityData.ts"
import type { ItemCatalog } from "#/data/items/itemUtils.ts"
import type { RunnerData } from "#/data/runner/runnerData.ts"
import { getItemCatalog } from "#/data/runner/runnerTraits.ts"

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
