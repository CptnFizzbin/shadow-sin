import { isAdept } from "#/components/runner/adeptPowers/adeptPowersUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useEntitySelector } from "#/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { PowersSelectors } from "#/stores/runner/powers/powersSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export const useAdeptPowersAlerts = (): AlertInfo[] => {
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)
  const magicAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.magic })
  const powerPointsUsed = useRunnerSelector(PowersSelectors.selectUsed)

  const statuses: AlertInfo[] = []

  if (!isAdept(awakeningType)) return statuses

  const powerPointsMax = magicAttr

  if (powerPointsUsed > powerPointsMax) {
    statuses.push({
      section: "Adept Powers",
      severity: "error",
      title: "Power Points Exceeded",
      message: `Power points used (${powerPointsUsed}) exceeds maximum (${powerPointsMax}).`,
    })
  }

  return statuses
}
