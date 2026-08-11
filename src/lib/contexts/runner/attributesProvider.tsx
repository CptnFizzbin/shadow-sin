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
 * Reads the nearest `AttributesProvider`'s value. Not for component use — `useAttrSelector` (any
 * entity) and `useRunnerSelector`'s `attributes` namespace (always the Runner) are the sanctioned
 * consumers (see `docs/adr/0013-unify-runner-state-access.md`); everyone else reads attributes
 * through one of those instead of reaching into this context directly.
 */
export const useAttributesContext = (): AttributesContextValue => {
  const context = useContext(AttributesContext)

  if (!context) {
    throw new OutOfContextError("useAttributesContext", "AttributesProvider")
  }

  return context
}

/**
 * @deprecated Reads the raw stored value, before augments — use
 * `useRunnerSelector(({ attributes }) => attributes.forAttr(attr).baseValue)` for the Runner's own
 * attributes, or `useAttrSelector(({ forAttr }) => forAttr(attr).baseValue)` for the nearest
 * entity — see `docs/adr/0013-unify-runner-state-access.md`.
 */
export const useAttrValue = (attr: AttributeKey): number => {
  return useAttributesContext().values[attr] ?? 0
}

/**
 * @deprecated Use `useRunnerSelector(({ attributes }) => attributes.forAttr(attr))` for the
 * Runner's own attributes, or `useAttrSelector(({ forAttr }) => forAttr(attr))` for the nearest
 * entity — each field (`min`/`max`/`augMax`/`baseValue`/`value`) is read individually rather than
 * as one bundled `AttributeInfo` object. See `docs/adr/0013-unify-runner-state-access.md`.
 */
export const useAttrInfo = (attr: AttributeKey): AttributeInfo => {
  return useAttributesContext().infos[attr]
}

/**
 * @deprecated Use `useRunnerSelector(({ attributes }) => attributes.all)` for the Runner's own
 * attributes, or `useAttrSelector(({ all }) => all)` for the nearest entity — see
 * `docs/adr/0013-unify-runner-state-access.md`.
 */
export const useAllAttrInfos = (): Record<AttributeKey, AttributeInfo> => {
  return useAttributesContext().infos
}
