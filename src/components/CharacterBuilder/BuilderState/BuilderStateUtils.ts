import { useBuildStateStore } from "#/components/CharacterBuilder/BuilderState/BuilderStateProvider.tsx"

export const useMaxBuildPoints = () => {
  return useBuildStateStore((state) => state.maxBuildPoints)
}
