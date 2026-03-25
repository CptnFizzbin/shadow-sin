import type { BuildPointsInfo } from "#/components/CharacterBuilder/BuildPoints/BuildPointsUtils.ts"
import { useCharacterBuilderStoreSlice } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"

export interface QualityBuildPoints extends BuildPointsInfo {
  positive: number
  negative: number
}

export const getQualityBpValue = (quality: {
  bpValue?: number
  type: "positive" | "negative"
}) => {
  const bpValue = quality.bpValue ?? 0
  return quality.type === "positive" ? bpValue : -bpValue
}

export const useQualitiesBuildSlice = () => {
  return useCharacterBuilderStoreSlice(
    (state) => state.qualities,
    (state, nextValue) => ({ ...state, qualities: nextValue }),
  )
}

export const useQualitiesBuildPoints = (): QualityBuildPoints => {
  const qualities = useQualitiesBuildSlice()

  const negativeBp = qualities.state
    .filter((q) => q.type === "negative")
    .map(getQualityBpValue)
    .reduce((total, bpValue) => total + bpValue, 0)

  const positiveBp = qualities.state
    .filter((q) => q.type === "positive")
    .map(getQualityBpValue)
    .reduce((total, bpValue) => total + bpValue, 0)

  return {
    spent: positiveBp + negativeBp,
    positive: positiveBp,
    negative: negativeBp,
  }
}
