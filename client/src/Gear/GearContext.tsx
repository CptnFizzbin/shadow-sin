import { createContext, FC, useContext } from 'react'

import { RecordId } from '../Api/Model'
import { GearData, GearType } from './GearData'

const GearContext = createContext<GearData[]>([])

interface GearProviderProps {
  gear: GearData[]
}

export const GearProvider: FC<GearProviderProps> = ({
  gear,
  children,
}) => {
  return (
    <GearContext.Provider value={gear}>{children}</GearContext.Provider>
  )
}

export function useAllGear (): GearData[] {
  return useContext(GearContext)
}

export function useGear<T extends GearData = GearData> (gearId: RecordId | undefined): T | undefined {
  const allGear = useAllGear()
  if (!gearId) return undefined

  const gear = allGear.find(gear => gear.id === gearId)
  return gear ? gear as T : undefined
}

type GearFilter = (gear: GearData) => boolean

export function useFindGear<T extends GearData = GearData> (filter: GearFilter): T | undefined {
  const foundGear = useAllGear().find(filter)
  return foundGear ? foundGear as T : undefined
}

export function useFilterGear<T extends GearData = GearData> (filter: GearFilter): T[] {
  return useAllGear().filter(filter).map(gear => gear as T)
}

export function useNestedGear (gearId: RecordId): GearData[] {
  return collectNestedGear(gearId, useAllGear())
}

function collectNestedGear (parentId: RecordId, allGear: GearData[]) {
  const children = allGear.filter(gear => gear.attachedTo === parentId)
  let gear = [...children]

  children.forEach(child => {
    gear = [...gear, ...collectNestedGear(child.id, allGear)]
  })

  return gear
}

export function useGearOfType<T extends GearData> (gearType: GearType): T[] {
  return useFilterGear<T>(gear => gear.gearType === gearType)
}
