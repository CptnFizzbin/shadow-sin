import { createContext, FC, useContext } from 'react'

import { AttributeData, AttributeList, AttributeValue } from './Attribute'

const AttributeContext = createContext<AttributeList>({})

interface AttributeProviderProps {
  attributes: AttributeList
}

export const AttributeProvider: FC<AttributeProviderProps> = ({
  attributes,
  children,
}) => {
  return (
    <AttributeContext.Provider value={attributes}>{children}</AttributeContext.Provider>
  )
}

export const useAttributes = (): AttributeList => {
  return useContext(AttributeContext)
}

export function useAttribute<T extends AttributeValue> (name: string): AttributeData<T> | undefined {
  return useAttributes()[name] as AttributeData<T>
}

export function useAttributeValue<T extends AttributeValue> (name: string, defaultValue: T): T {
  return useAttributes()[name]?.value as T || defaultValue
}
