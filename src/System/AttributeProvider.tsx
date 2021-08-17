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
  console.log('attributes', attributes)

  return (
    <AttributeContext.Provider value={attributes}>{children}</AttributeContext.Provider>
  )
}

export const useAttributes = (): AttributeData[] => {
  const attributes = useContext(AttributeContext)
  console.log('attributes', attributes)
  return attributes
}

export const useAttribute = (name: string): AttributeData | undefined => {
  return useAttributes().find(attr => attr.name === name)
}
