import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

/**
 * The Entity currently in scope for `useEntitySelector`. Kept as `object` rather than
 * `EntityData` — not every Entity kind this can hold (e.g. Spirit/Sprite, which have no `source`
 * field and don't use `EntityData.rating`) structurally satisfies `EntityData`'s full shape.
 * Callers narrow to whatever trait(s) their selector's `TState` needs (`EntityWithAttrs`, ...),
 * the same way `useRunnerSelector` narrows `RunnerData`.
 */
const EntityContext = createContext<object | null>(null)

interface EntityProviderProps extends PropsWithChildren {
  entity: object
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

const useEntityContext = (): object => {
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
export function useEntitySelector<TState extends { entity: object }, TReturn>(
  selector: Selector<TState, TReturn>,
): TReturn
export function useEntitySelector<TState extends { entity: object }, TReturn, TOptions extends object>(
  selector: Selector<TState, TReturn, TOptions>,
  options: TOptions,
): TReturn
export function useEntitySelector<TState extends { entity: object }, TReturn, TOptions extends object>(
  selector: (state: TState, options?: TOptions) => TReturn,
  options?: TOptions,
): TReturn {
  const entity = useEntityContext()

  // The Context only ever holds `object` — narrowing to whatever `TState`'s `entity` trait(s)
  // require is the caller's responsibility, same as `useRunnerSelector`'s `assembleRunnerState`
  // cast (see docs/adr/0014-selector-input-decomposition.md).
  return selector({ entity } as TState, options)
}
