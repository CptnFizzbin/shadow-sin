import type { FC, PropsWithChildren } from "react"

import type { EntityData } from "#/system/model/entities/entityData.ts"

import { EntityContext } from "./entity.context.ts"

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
