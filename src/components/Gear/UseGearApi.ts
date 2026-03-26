import { useContext } from "react"

import { GearContext } from "#/components/Gear/GearProvider.tsx"

export function useGearApi() {
  const api = useContext(GearContext)

  if (!api) {
    throw new Error("useGearApi must be used within a GearProvider")
  }

  return api
}
