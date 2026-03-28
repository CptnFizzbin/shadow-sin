import type { BuildPointsInfo } from "#/components/CharacterBuilder/Sections/BuildPoints/BuildPointsUtils.ts"
import { useBuilderQualitiesApi } from "#/components/CharacterBuilder/Sections/Qualities/UseQualitiesApi.ts"

export const MAX_NEGATIVE_QUALITY_BP = 35

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

export const useBuilderQualitiesBuildPoints = (): QualityBuildPoints => {
  const { qualities } = useBuilderQualitiesApi()

  const negativeBp = qualities
    .filter((q) => q.type === "negative")
    .map(getQualityBpValue)
    .reduce((total, bpValue) => total + bpValue, 0)

  const positiveBp = qualities
    .filter((q) => q.type === "positive")
    .map(getQualityBpValue)
    .reduce((total, bpValue) => total + bpValue, 0)

  return {
    spent: positiveBp + negativeBp,
    positive: positiveBp,
    negative: negativeBp,
  }
}
