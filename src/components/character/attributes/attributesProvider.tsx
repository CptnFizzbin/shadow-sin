import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import type { AttributeInfo } from "#/system/attributeInfo.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"

interface AttributesContextValue {
  values: Record<AttributeKey, number>
  infos: Record<AttributeKey, AttributeInfo>
}

const AttributesContext = createContext<AttributesContextValue | null>(null)

interface AttributesProviderProps extends PropsWithChildren {
  values: Record<AttributeKey, number>
  infos: Record<AttributeKey, AttributeInfo>
}

/**
 * Provides attribute values and metadata (min/max/augMax) to the component tree.
 * Wrap a subtree with this provider to swap the attribute source from the character
 * to a device, agent, spirit, sprite, or other entity.
 *
 * The `CharacterSheetProvider` automatically nests a bridge that populates this
 * context from the character sheet, so most consumers do not need to render this
 * provider directly.
 */
export const AttributesProvider: FC<AttributesProviderProps> = ({ values, infos, children }) => {
  return (
    <AttributesContext.Provider value={{ values, infos }}>
      {children}
    </AttributesContext.Provider>
  )
}

const useAttributesContext = (): AttributesContextValue => {
  const context = useContext(AttributesContext)

  if (!context) {
    throw new Error("useAttributesContext must be used within an AttributesProvider")
  }

  return context
}

/**
 * Returns the current numeric value for the given attribute from the nearest
 * `AttributesProvider`.
 */
export const useAttrValue = (attr: AttributeKey): number => {
  return useAttributesContext().values[attr]
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
