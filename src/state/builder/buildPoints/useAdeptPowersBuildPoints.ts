import { isAdept } from "#/rules/buildPoints/adeptPowersUtils.ts"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import type { BpLineItem } from "./bpLineItem.ts"

export const useAdeptPowersBuildPoints = (): BpLineItem => {
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)

  return {
    sectionId: BuilderSectionId.adeptPowers,
    spent: 0,
    enabled: isAdept(awakeningType),
  }
}
