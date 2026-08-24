import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { isAdept } from "#/components/runner/adeptPowers/adeptPowersUtils.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const selectAdeptPowersBuildPoints: Selector<{ runner: RunnerData }, BpLineItem> = createMemoizedSelector(
  BiologySelectors.selectAwakening,
  (awakeningType): BpLineItem => ({
    sectionId: BuilderSectionId.adeptPowers,
    spent: 0,
    enabled: isAdept(awakeningType),
  }),
)
