import { createContext, FC, useContext } from 'react'

import { AttrList, AttrType, AttrValue } from './Attribute'

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

export const useAttributes = (): AttrList => {
  return useContext(AttributeContext)
}

export function useAttribute<T extends AttrValue> (type: AttrType, defaultValue: T): T {
  return (useAttributes()[type] as T) || defaultValue
}
