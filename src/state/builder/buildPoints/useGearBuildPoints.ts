import { getTotalCost } from "#/app/components/entities/items/builder/gearUtils.ts"
import { BuilderConfig } from "#/rules/buildPoints/builderConfig.ts"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { LifestyleSelectors } from "#/state/runner/lifestyle/lifestyle.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import type { BpLineItem } from "./bpLineItem.ts"

export const useGearTotalCost = () => {
  const gear = useRunnerSelector(ItemSelectors.selectAll)
  const allGear = Object.values(gear)

  const lifestyleCost = useRunnerSelector(LifestyleSelectors.selectPrepaidCost)

  const gearCost = getTotalCost(...allGear)
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
