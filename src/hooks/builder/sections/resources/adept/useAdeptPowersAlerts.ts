import { isAdept } from "#/components/adeptPowers/viewer/adeptPowersUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useEntitySelector } from "#/hooks/entity/useEntitySelector.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { PowersSelectors } from "#/state/runner/powers/powers.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"

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
