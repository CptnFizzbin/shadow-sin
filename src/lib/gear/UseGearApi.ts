import { useContext } from "react"

import { BuilderGearContext } from "#/lib/gear/BuilderGearProvider.tsx"
import { GearContext } from "#/lib/gear/GearContext.tsx"

export function useGearApi() {
  const viewerApi = useContext(GearContext)
  const builderApi = useContext(BuilderGearContext)
  const api = viewerApi ?? builderApi

  if (!api) {
    throw new Error(
      "useGearApi must be used within a GearProvider or BuilderGearProvider",
    )
  }

  return api
}
