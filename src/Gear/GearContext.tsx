import { createContext, FC, useContext } from 'react'

import { GearData, GearId, GearType } from './GearData'

interface GearContextData {
  gear: GearData[]

  add (gear: GearData): void

  update (gear: GearData): void

  remove (gear: GearData): void
}

const GearContext = createContext<GearContextData>({
  gear: [],
  add: () => { /* ReadOnly */ },
  update: () => { /* ReadOnly */ },
  remove: () => { /* ReadOnly */ },
})

interface GearProviderProps {
  gear: GearData[]

  onChange (gear: GearData[]): void
}

export const GearProvider: FC<GearProviderProps> = ({
  gear,
  onChange,
  children,
}) => {
  const contextData: GearContextData = {
    gear,

    add (gearData: GearData) {
      const allIds: number[] = gear
        .map(gear => gear.id)
        .filter(id => typeof id === 'number')
        .map(id => id as number)
      const nextId = Math.max(...allIds)

      onChange([
        ...gear,
        {
          ...gearData,
          id: nextId + 1,
        },
      ])
    },

    update (gearData: GearData) {
      const index = gear.findIndex(gear => gear.id === gearData.id)
      gear = [...gear]
      gear[index] = gearData
      onChange(gear)
    },

    remove (gearData: GearData) {
      const index = gear.findIndex(gear => gear.id === gearData.id)
      gear = [...gear]
      gear.splice(index, 1)
      onChange(gear)
    },
  }

  return (
    <GearContext.Provider value={contextData}>{children}</GearContext.Provider>
  )
}

type GearAction = (gearData: GearData) => void

export function useAddGear (): GearAction {
  const { add } = useContext(GearContext)
  return add
}

export function useUpdateGear (): GearAction {
  const { update } = useContext(GearContext)
  return update
}

export function useRemoveGear (): GearAction {
  const { remove } = useContext(GearContext)
  return remove
}

export function useAllGear (): GearData[] {
  const { gear } = useContext(GearContext)
  return gear
}

export function useGear<T extends GearData> (gearId: GearId | undefined): T | undefined {
  const allGear = useAllGear()

  if (!gearId) return undefined
  const gear = allGear.find(gear => gear.id === gearId)
  return gear ? gear as T : undefined
}

interface GearHookOptions {
  type?: GearType

  filter? (gear: GearData): boolean
}

export function useAttachedGear<T extends GearData = GearData> (gearId: GearId, options: GearHookOptions = {}): T[] {
  let gear = useFilterGear(gear => gear.attachedTo === gearId)

  if (options.type) {
    gear = gear.filter(gear => gear.gearType === options.type)
  }

  if (options.filter) {
    gear = gear.filter(options.filter)
  }

  return gear.map(gear => gear as T)
}

export function useGearOfType<T extends GearData = GearData> (gearType: GearType): T[] {
  return useFilterGear<T>(gear => gear.gearType === gearType)
}

type GearFilter = (gear: GearData) => boolean

export function useFindGear<T extends GearData = GearData> (filter: GearFilter): T | undefined {
  const foundGear = useAllGear().find(filter)
  return foundGear ? foundGear as T : undefined
}

export function useFilterGear<T extends GearData = GearData> (filter: GearFilter): T[] {
  return useAllGear().filter(filter).map(gear => gear as T)
}
