import { createContext, FC, useContext } from 'react'

import { AutosoftAttr } from './AutosoftAttr'
import { AutosoftData } from './AutosoftData'

const AutosoftContext = createContext<AutosoftData[]>([])

interface AutosoftProviderProps {
  autosofts: AutosoftData[]
}

export const AutosoftProvider: FC<AutosoftProviderProps> = ({
  autosofts,
  children,
}) => {
  return (
    <AutosoftContext.Provider value={autosofts}>{children}</AutosoftContext.Provider>
  )
}

export const useAutosoft = (name: string): AutosoftData | undefined => {
  const autosofts = useContext(AutosoftContext)
  return autosofts.find(autosoft => autosoft.name === name)
}

export const useTargetingAutosoft = (weaponName: string): number | undefined => {
  return useContext(AutosoftContext)
    .find(autosoft => autosoft.attributes[AutosoftAttr.weapon] === weaponName)
    ?.attributes[AutosoftAttr.rating]
}
