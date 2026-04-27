import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { isAdept } from "#/components/character/adeptPowers/adeptPowersUtils.ts"
import {
  selectAwakeningType,
  useCharacterSheetSelector,
} from "#/components/character/sheet/characterSheet.selectors.ts"

export const useAdeptPowersBuildPoints = (): BpLineItem => {
  const awakeningType = useCharacterSheetSelector(selectAwakeningType)

  return {
    sectionId: BuilderSectionId.adeptPowers,
    spent: 0,
    enabled: isAdept(awakeningType),
  }
}
