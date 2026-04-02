import { useStore } from "@tanstack/react-store"

import type { BuildPointsInfo } from "#/components/CharacterBuilder/BuildPoints/BuildPointsUtils.ts"
import { useQualitiesStore } from "#/components/Qualities/UseQualitiesStore.ts"

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
  const qualitiesStore = useQualitiesStore()
  const qualities = useStore(qualitiesStore, (state) => state)

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
