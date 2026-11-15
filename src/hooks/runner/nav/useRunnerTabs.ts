import type { RunnerSection } from "#/components/runner/sections/runnerSections.ts"
import { runnerSectionOrder, runnerSections } from "#/components/runner/sections/runnerSections.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { isVehicleData, VehicleCategory } from "#/system/model/items/vehicleData.ts"

export function useRunnerTabs(): RunnerSection[] {
  const awakening = useRunnerSelector(BiologySelectors.selectAwakening)
  const items = useRunnerSelector(ItemSelectors.selectAll)
  const hasDrones = Object.values(items).some(
    (item) => isVehicleData(item) && item.vehicleCategory === VehicleCategory.drone,
  )

  return runnerSectionOrder.filter((section) => {
    if (section.id === runnerSections.drones.id && !hasDrones) return false
    return !section.visibleFor || section.visibleFor.includes(awakening)
  })
}
