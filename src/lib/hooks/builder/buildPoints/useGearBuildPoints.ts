import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { getTotalCost } from "#/components/builder/sections/gear/gearUtils.ts"
import { ItemSelectors } from "#/lib/stores/runner/gear/gearSlice.selectors.ts"
import { useRunnerSelector, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { Lifestyles, LifestyleType } from "#/system/lifestyleType.ts"

export const useGearTotalCost = () => {
  const gear = useRunnerSelector(ItemSelectors.selectAll)
  const allGear = Object.values(gear)

  const lifestyle = useRunnerStoreSelector((state) => {
    const lifestyleType = state.profile.lifestyle?.quality ?? LifestyleType.Street
    return Lifestyles[lifestyleType]
  })
  const lifestyleMonths = useRunnerStoreSelector(
    (state) => state.profile.lifestyle?.monthsPaid ?? 1,
  )

  const gearCost = getTotalCost(...allGear)
  const lifestyleCost = lifestyle.upkeep * lifestyleMonths
  return gearCost + lifestyleCost
}

export const useGearBuildPoints = (): BpLineItem => {
  const gearNuyenCost = useGearTotalCost()
  const gearBuildPoints = Math.ceil(gearNuyenCost / BuilderConfig.gear.nuyenPerBp)

  return {
    sectionId: BuilderSectionId.gear,
    spent: gearBuildPoints,
    allowance: BuilderConfig.gear.bpAllowance,
    isOverBudget: gearBuildPoints > BuilderConfig.gear.bpAllowance,
  }
}
