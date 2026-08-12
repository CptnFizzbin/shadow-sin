import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useMemo } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"
import type { AttributeInfo } from "#/system/attributeInfo.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"

export interface AttributesContextValue {
  values: Partial<Record<AttributeKey, number>>
  infos: Record<AttributeKey, AttributeInfo>
}

const AttributesContext = createContext<AttributesContextValue | null>(null)

interface AttributesProviderProps extends PropsWithChildren {
  values: Partial<Record<AttributeKey, number>>
  infos: Record<AttributeKey, AttributeInfo>
}

/**
 * Provides attribute values and metadata (min/max/augMax) to the component tree.
 * Wrap a subtree with this provider to swap the attribute source from the runner
 * to a device, agent, spirit, sprite, or other entity.
 *
 * The `RunnerDataProvider` automatically nests a bridge that populates this
 * context from the runner sheet, so most consumers do not need to render this
 * provider directly.
 */
export const AttributesProvider: FC<AttributesProviderProps> = ({ values, infos, children }) => {
  const contextValue = useMemo(() => ({ values, infos }), [values, infos])

  return (
    <AttributesContext.Provider value={contextValue}>
      {children}
    </AttributesContext.Provider>
  )
}

/**
 * Reads the nearest `AttributesProvider`'s value. Not for component use — `useRunnerSelector`'s
 * `attribute` catalog entry is the only sanctioned consumer (see
 * `docs/adr/0013-unify-runner-state-access.md`); everyone else reads attributes through that
 * catalog instead of reaching into this context directly.
 */
export const useAttributesContext = (): AttributesContextValue => {
  const context = useContext(AttributesContext)

  if (!context) {
    throw new OutOfContextError("useAttributesContext", "AttributesProvider")
  }

  return context
}

/**
 * @deprecated Use `useRunnerSelector(({ attribute }) => attribute(attr).baseValue)` instead — see
 * `docs/adr/0013-unify-runner-state-access.md`.
 */
export const useAttrValue = (attr: AttributeKey): number => {
  return useAttributesContext().values[attr] ?? 0
}

/**
 * @deprecated Use `useRunnerSelector(({ attribute }) => attribute(attr).info)` instead — see
 * `docs/adr/0013-unify-runner-state-access.md`.
 */
export const useAttrInfo = (attr: AttributeKey): AttributeInfo => {
  return useAttributesContext().infos[attr]
}

/**
 * @deprecated Use `useRunnerSelector(({ attribute }) => attribute.infos)` instead — see
 * `docs/adr/0013-unify-runner-state-access.md`.
 */
export const useAllAttrInfos = (): Record<AttributeKey, AttributeInfo> => {
  return useAttributesContext().infos
}
