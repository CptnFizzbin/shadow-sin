import type { Store } from "@tanstack/store"
import type { FC, PropsWithChildren } from "react"
import { createContext, useMemo } from "react"

import type { GearApi } from "#/components/Gear/GearApi.ts"
import { createGearApi } from "#/components/Gear/GearApi.ts"
import type { ItemData } from "#/lib/system/ItemData.ts"

export const GearContext = createContext<GearApi | null>(null)

interface GearProviderProps<TState extends { gear: Record<string, ItemData> }> extends PropsWithChildren {
  store: Store<TState>
}

export function GearProvider<TState extends { gear: Record<string, ItemData> }>({
  store,
  children,
}: GearProviderProps<TState>): ReturnType<FC> {
  const gearApi = useMemo(() => createGearApi(store), [store])
  return <GearContext.Provider value={gearApi}>{children}</GearContext.Provider>
}
