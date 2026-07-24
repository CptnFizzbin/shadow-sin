import pluralize from "pluralize"

import { useGearBuildPoints } from "#/components/builder/buildPoints/hooks/useGearBuildPoints.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { useEncumbrance } from "#/components/system/encumbrance/useEncumbrance.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useEditorMode } from "#/stores/builder/editorMode.tsx"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { useGearAvailabilityIssues } from "./gearUtils.ts"

export const useGearAlerts = (): AlertInfo[] => {
  const { totalInvalidCount } = useGearAvailabilityIssues()
  const { isOverBudget } = useGearBuildPoints()
  const { isEncumbered, penalty, totalBallistic, totalImpact, threshold } = useEncumbrance()
  const { isEdit } = useEditorMode()

  const alerts: AlertInfo[] = []

  if (isOverBudget && !isEdit) {
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

  const gear = useRunnerStoreSelector((s) => s.gear)
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
