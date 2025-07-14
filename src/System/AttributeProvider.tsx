import { createContext, FC, useContext } from "react"

import { AttrList, AttrType, AttrValue } from "./Attribute"

const AttributeContext = createContext<AttrList>({})

interface AttributeProviderProps {
  attributes: AttrList
}

export const AttributeProvider: FC<AttributeProviderProps> = ({
  attributes,
  children,
}) => {
  const parentAttrs = useAttributes()

  return (
    <AttributeContext.Provider value={{ ...parentAttrs, ...attributes }}>
      {children}
    </AttributeContext.Provider>
  )
}

export const useAttributes = (keys?: string[]): AttrList => {
  const allAttributes = useContext(AttributeContext)
  if (!keys) return allAttributes

  const filtered: AttrList = {}
  keys.forEach((key) => (filtered[key] = allAttributes[key]))
  return filtered
}

export function useAttribute<T extends AttrValue>(type: AttrType): T {
  return useAttributes()[type] as T
}
