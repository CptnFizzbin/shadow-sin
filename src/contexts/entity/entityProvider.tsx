import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import { useRunner } from "#/contexts/runner/runnerStore.context.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"
import type { EntityScope } from "#/stores/entityScope.ts"
import { getEntityScope } from "#/stores/entityScope.ts"
import type { EntityData } from "#/system/entityData.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export interface EntitySelectorState {
  runner: RunnerData
  entity: object
  items: ItemCatalog
}

/**
 * The Entity currently in scope for `useEntitySelector`. Kept as `object` rather than
 * `EntityBase` — not every Entity kind this can hold (e.g. Spirit/Sprite, which have no `source`
 * field and don't use `EntityData.rating`) structurally satisfies `EntityData`'s full shape.
 * Callers narrow to whatever trait(s) their selector's `TState` needs (`EntityWithAttrs`, ...),
 * the same way `useRunnerSelector` narrows `RunnerData`.
 */
const EntityContext = createContext<EntityData | null>(null)

interface EntityProviderProps extends PropsWithChildren {
  entity: EntityData
}

/**
 * Provides the Entity in scope for `useEntitySelector` to the component tree. Wrap a subtree with
 * this provider to swap the entity in scope away from the Runner — a device, agent, spirit,
 * sprite, or other Entity — for everything nested inside; nested `EntityProvider`s shadow outer
 * ones with standard Context semantics.
 *
 * `RunnerStoreProvider` already nests a `RunnerEntityProvider` populated from the runner sheet, so
 * most consumers never render this directly.
 */
export const EntityProvider: FC<EntityProviderProps> = ({ entity, children }) => {
  return (
    <EntityContext.Provider value={entity}>
      {children}
    </EntityContext.Provider>
  )
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
