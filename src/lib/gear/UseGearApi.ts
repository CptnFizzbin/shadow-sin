import { useGearContext } from "#/lib/gear/GearProvider.tsx"

export function useGearApi() {
  return useGearContext()
}
