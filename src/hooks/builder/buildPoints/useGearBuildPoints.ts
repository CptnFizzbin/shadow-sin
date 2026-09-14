import type { BpLineItem } from "#/components/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { getTotalCost } from "#/components/items/builder/gearUtils.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { ProfileSelectors } from "#/state/runner/profile/profile.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { Lifestyles, LifestyleType } from "#/system/model/finances/lifestyleType.ts"

export const useGearTotalCost = () => {
  const gear = useRunnerSelector(ItemSelectors.selectAll)
  const allGear = Object.values(gear)

  const lifestyleQuality = useRunnerSelector(ProfileSelectors.selectLifestyleQuality)
  const lifestyle = Lifestyles[lifestyleQuality ?? LifestyleType.Street]
  const lifestyleMonths = useRunnerSelector(ProfileSelectors.selectLifestyleMonthsPaid) ?? 1

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
