import { createContext, FC, useContext } from 'react'

import { AttributeData } from './Attribute'

const AttributeContext = createContext<AttributeData[]>([])

interface AttributeProviderProps {
  attributes: AttributeData[]
}

export const AttributeProvider: FC<AttributeProviderProps> = ({
  attributes,
  children,
}) => {
  return (
    <AttributeContext.Provider value={attributes}>{children}</AttributeContext.Provider>
  )
}

export const useAttributes = (): AttributeData[] => {
  return useContext(AttributeContext)
}

export const useAttribute = (name: string): AttributeData | undefined => {
  return useAttributes().find(attr => attr.name === name)
}
