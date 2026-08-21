import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { QualitiesSelectors } from "#/lib/stores/runner/qualities/qualitiesSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

interface QualitiesBuildPoints extends BpLineItem {
  positive: number
  negative: number
}

export const useQualitiesBuildPoints = (): QualitiesBuildPoints => {
  const qualities = useRunnerSelector(QualitiesSelectors.selectAll)

  const positiveQualities = qualities
    .filter((q) => q.type === "positive")

  const positiveBp = positiveQualities
    .reduce((acc, q) => acc + (q.bpValue ?? 0), 0)

  const negativeQualities = qualities
    .filter((q) => q.type === "negative")

  const negativeBp = negativeQualities
    .reduce((acc, q) => acc + (q.bpValue ?? 0), 0)

  return {
    sectionId: BuilderSectionId.qualities,
    spent: positiveBp - negativeBp,
    positive: positiveBp,
    negative: negativeBp,
  }
}
