import type { FC, PropsWithChildren } from "react"
import { createContext, useMemo } from "react"

import { useCharacterBuilderStoreSlice } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { GearApi } from "#/lib/gear/GearApi.ts"
import { createGearApi } from "#/lib/gear/GearApi.ts"

export const BuilderGearContext = createContext<GearApi | null>(null)

export const BuilderGearProvider: FC<PropsWithChildren> = ({ children }) => {
  const gearSlice = useCharacterBuilderStoreSlice(
    (state) => state.gear,
    (state, gear) => {
      state.gear = gear
      return state
    },
  )

  const gearApi = useMemo(() => createGearApi(gearSlice), [gearSlice])

  return (
    <BuilderGearContext.Provider value={gearApi}>
      {children}
    </BuilderGearContext.Provider>
  )
}
