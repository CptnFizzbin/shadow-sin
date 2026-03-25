import type { FC, PropsWithChildren } from "react"
import { createContext, useMemo } from "react"

import { useCharacterStoreSlice } from "#/components/Character/CharacterStoreProvider.tsx"
import type { GearApi } from "#/lib/gear/GearApi.ts"
import { createGearApi } from "#/lib/gear/GearApi.ts"

export const GearContext = createContext<GearApi | null>(null)

export const GearProvider: FC<PropsWithChildren> = ({ children }) => {
  const gearSlice = useCharacterStoreSlice(
    (state) => state.gear,
    (state, gear) => {
      state.gear = gear
      return state
    },
  )

  const gearApi = useMemo(() => createGearApi(gearSlice), [gearSlice])

  return <GearContext.Provider value={gearApi}>{children}</GearContext.Provider>
}
