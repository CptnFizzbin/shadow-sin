import { createContext, FC, useContext } from 'react'

import { AttributeData, AttributeList, AttributeValue, AttrType } from './Attribute'

const AttributeContext = createContext<AttributeList>({})

interface AttributeProviderProps {
  attributes: AttributeList
}

export const AttributeProvider: FC<AttributeProviderProps> = ({
  attributes,
  children,
}) => {
  const parentAttrs = useAttributes()

  return (
    <AttributeContext.Provider
      value={{
        ...parentAttrs,
        ...attributes,
      }}
    >
      {children}
    </AttributeContext.Provider>
  )
}

export const useAttributes = (): AttributeList => {
  return useContext(AttributeContext)
}

export function useAttribute<T extends AttributeValue> (name: AttrType): AttributeData<T> | undefined {
  return useAttributes()[name] as AttributeData<T>
}

export function useAttributeValue<T extends AttributeValue> (name: AttrType, defaultValue: T): T {
  return useAttributes()[name]?.value as T || defaultValue
}
