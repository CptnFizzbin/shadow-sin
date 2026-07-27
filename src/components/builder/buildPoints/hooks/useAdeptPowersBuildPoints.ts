import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { isAdept } from "#/components/runner/adeptPowers/adeptPowersUtils.ts"
import { selectAwakening } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const useAdeptPowersBuildPoints = (): BpLineItem => {
  const awakeningType = useRunnerStoreSelector(selectAwakening)

  return {
    sectionId: BuilderSectionId.adeptPowers,
    spent: 0,
    enabled: isAdept(awakeningType),
  }
}
