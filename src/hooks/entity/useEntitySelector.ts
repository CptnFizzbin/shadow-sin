import { useContext } from "react"

import { useRunner } from "#/hooks/runner/useRunnerStore.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { getEntityScope } from "#/state/entityScope.ts"
import type { EntityData } from "#/system/model/entities/entityData.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { OutOfContextError } from "#/utils/errors/outOfContextError.ts"

import { EntityContext } from "#/contexts/entity/entity.context.ts"

export interface EntitySelectorState {
  runner: RunnerData
  entity: object
  items: ItemCatalog
}

const useEntityContext = (): EntityData => {
  const entity = useContext(EntityContext)

  if (!entity) {
    throw new OutOfContextError("useEntitySelector", "EntityProvider")
  }

  return entity
}

/**
 * Reads a value relative to the nearest `EntityProvider` in the tree — the standardized way to
 * scope a namespaced selector (`AttrSelectors.selectValue`, ...) to whichever Entity is currently
 * in scope, entity-agnostic by design. Contrast with `useRunnerSelector`, which always means the
 * Runner's own state regardless of `EntityProvider` nesting. See
 * docs/adr/0014-selector-input-decomposition.md.
 *
 * @example
 * const droneAgility = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.agility })
 */
export function useEntitySelector<TReturn>(
  selector: Selector<EntityScope, TReturn>,
): TReturn
export function useEntitySelector<TReturn, TOptions extends object>(
  selector: Selector<EntityScope, TReturn, TOptions>,
  options: TOptions,
): TReturn
export function useEntitySelector<TReturn, TOptions extends object>(
  selector: (state: EntityScope, options?: TOptions) => TReturn,
  options?: TOptions,
): TReturn {
  const entity = useEntityContext()
  const runner = useRunner()

  // The Context only ever holds `object` — narrowing to whatever `TState`'s `entity` trait(s)
  // require is the caller's responsibility, same as `useRunnerSelector`'s `assembleRunnerState`
  // cast (see docs/adr/0014-selector-input-decomposition.md).
  return selector(getEntityScope(runner, entity), options)
}
