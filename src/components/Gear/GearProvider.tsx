import type { FC, PropsWithChildren } from "react"
import { createContext, useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/Hooks/UseCharacterSheetContext.tsx"
import type { GearApi } from "#/components/Gear/GearApi.ts"
import { createGearApi } from "#/components/Gear/GearApi.ts"

export const GearContext = createContext<GearApi | null>(null)

export const GearProvider: FC<PropsWithChildren> = ({ children }) => {
  const store = useCharacterSheetContext()
  const gearApi = useMemo(() => createGearApi(store), [store])
  return <GearContext.Provider value={gearApi}>{children}</GearContext.Provider>
}
