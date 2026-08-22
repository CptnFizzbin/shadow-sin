import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useMemo } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"
import type { AttributeInfo } from "#/system/attributeInfo.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"

interface AttributesContextValue {
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

export const useAttributesContext = (): AttributesContextValue => {
  const context = useContext(AttributesContext)

  if (!context) {
    throw new OutOfContextError("useAttributesContext", "AttributesProvider")
  }

  return context
}

/**
 * Returns the current numeric value for the given attribute from the nearest
 * `AttributesProvider`.
 */
export const useAttrValue = (attr: AttributeKey): number => {
  return useAttributesContext().values[attr] ?? 0
}

/**
 * Returns the metadata (min, max, augMax) for the given attribute from the
 * nearest `AttributesProvider`.
 */
export const useAttrInfo = (attr: AttributeKey): AttributeInfo => {
  return useAttributesContext().infos[attr]
}

/**
 * Returns all attribute metadata records from the nearest `AttributesProvider`.
 */
export const useAllAttrInfos = (): Record<AttributeKey, AttributeInfo> => {
  return useAttributesContext().infos
}
