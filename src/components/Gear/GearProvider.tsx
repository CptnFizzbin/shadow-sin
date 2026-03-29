import type { UUID } from "node:crypto"

import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"
import { createContext, useMemo } from "react"

import type { GearApi } from "#/components/Gear/GearApi.ts"
import { createGearApi } from "#/components/Gear/GearApi.ts"
import type { ItemData } from "#/lib/system/ItemData.ts"

export const GearContext = createContext<GearApi | null>(null)

interface GearProviderProps extends PropsWithChildren {
  store: Store<{ gear: Record<UUID, ItemData> }>
}

export const GearProvider: FC<GearProviderProps> = ({ store, children }) => {
  const gearApi = useMemo(() => createGearApi(store), [store])
  return <GearContext.Provider value={gearApi}>{children}</GearContext.Provider>
}
