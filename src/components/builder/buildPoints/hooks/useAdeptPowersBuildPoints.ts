import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { isAdept } from "#/components/runner/adeptPowers/adeptPowersUtils.ts"
import {
  selectAwakeningType,
  useRunnerDataSelector,
} from "#/components/runner/sheet/runnerData.selectors.ts"

export const useAdeptPowersBuildPoints = (): BpLineItem => {
  const awakeningType = useRunnerDataSelector(selectAwakeningType)

  return {
    sectionId: BuilderSectionId.adeptPowers,
    spent: 0,
    enabled: isAdept(awakeningType),
  }
}
