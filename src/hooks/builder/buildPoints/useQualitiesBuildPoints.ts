import type { BpLineItem } from "#/components/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { QualitiesSelectors } from "#/state/runner/qualities/qualities.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

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
