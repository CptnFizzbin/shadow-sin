import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { QualitiesSelectors } from "#/stores/runner/qualities/qualitiesSlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

interface QualitiesBuildPoints extends BpLineItem {
  positive: number
  negative: number
}

export const selectQualitiesBuildPoints: Selector<{ runner: RunnerData }, QualitiesBuildPoints> = createMemoizedSelector(
  QualitiesSelectors.selectAll,
  (qualities): QualitiesBuildPoints => {
    const positiveBp = qualities
      .filter((q) => q.type === "positive")
      .reduce((acc, q) => acc + (q.bpValue ?? 0), 0)

    const negativeBp = qualities
      .filter((q) => q.type === "negative")
      .reduce((acc, q) => acc + (q.bpValue ?? 0), 0)

    return {
      sectionId: BuilderSectionId.qualities,
      spent: positiveBp - negativeBp,
      positive: positiveBp,
      negative: negativeBp,
    }
  },
)
