import pluralize from "pluralize"

import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { useGearAvailabilityIssues } from "#/components/builder/sections/gear/gearUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useEditorMode } from "#/lib/contexts/builder/editorMode.tsx"
import { useGearBuildPoints } from "#/lib/hooks/builder/buildPoints/useGearBuildPoints.ts"
import { useEncumbrance } from "#/lib/hooks/system/encumbrance/useEncumbrance.ts"
import { ItemSelectors } from "#/lib/stores/runner/gear/gearSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const useGearAlerts = (): AlertInfo[] => {
  const { totalInvalidCount } = useGearAvailabilityIssues()
  const { isOverBudget } = useGearBuildPoints()
  const { isEncumbered, penalty, totalBallistic, totalImpact, threshold } = useEncumbrance()
  const editorMode = useEditorMode()

  const alerts: AlertInfo[] = []

  if (isOverBudget && editorMode.isBuilder) {
    alerts.push({
      section: "Gear",
      severity: "error",
      title: "Budget Exceeded",
      message: `Gear budget exceeded! Maximum is ${(BuilderConfig.gear.nuyenPerBp * BuilderConfig.gear.bpAllowance).toLocaleString()} (${BuilderConfig.gear.bpAllowance} BP).`,
    })
  }

  if (isEncumbered) {
    const exceededRatings: string[] = []
    if (totalBallistic > threshold) exceededRatings.push(`Ballistic ${totalBallistic}`)
    if (totalImpact > threshold) exceededRatings.push(`Impact ${totalImpact}`)
    alerts.push({
      section: "Gear",
      severity: "warning",
      title: "Armor Encumbrance",
      message: `Armor exceeds Body × 2 (${threshold}): ${exceededRatings.join(", ")}. −${penalty} to Agility and Reaction.`,
    })
  }

  if (totalInvalidCount > 0) {
    alerts.push({
      section: "Gear",
      severity: "warning",
      title: "Availability",
      message: `${totalInvalidCount} ${pluralize("gear item", totalInvalidCount)} exceed the maximum availability. Check highlighted items.`,
    })
  }

  const gear = useRunnerSelector(ItemSelectors.selectAll)
  if (Object.keys(gear).length === 0) {
    alerts.push({
      section: "Gear",
      severity: "warning",
      title: "No gear selected",
      message: "No gear has been added. Consider purchasing equipment or lifestyle upgrades.",
      summaryOnly: true,
    })
  }

  return alerts
}
