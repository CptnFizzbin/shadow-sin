import { createContext, FC, useContext } from 'react'

import { GearType } from '../../GearData'
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

export const useTargetingAutosoft = (weaponName: string): AutosoftData | undefined => {
  const autosofts = useContext(AutosoftContext)
  return autosofts
    .filter(autosoft => autosoft.gearType === GearType.autosoft)
    .map(autosoft => autosoft as AutosoftData)
    .find(autosoft => autosoft.attributes.weapon?.value === weaponName)
}
