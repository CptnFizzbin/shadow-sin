import { useEntitySelector } from "#/hooks/entity/useEntitySelector.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { DamageFormulas } from "#/system/formulas/damage/damageFormulas.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { DamageTrackKey } from "#/system/model/entities/damageTrackKey.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"

/**
 * An Agent's System/Firewall, Matrix damage-track max, attached running Programs, and a setter for
 * its Matrix damage. Must be called under an `EntityProvider` scoped to `agent`.
 */
export const useAgentMatrixStats = (agent: AgentData) => {
  const dispatch = useRunnerStoreDispatch()
  const children = useRunnerSelector(ItemSelectors.selectChildrenOf, { itemId: agent.id })
  const system = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.system })
  const firewall = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.firewall })

  return {
    system,
    firewall,
    damageMax: DamageFormulas.matrixMax({ system }),
    runningPrograms: Object.values(children),
    setMatrixDamage: (value: number) =>
      dispatch(Actions.item.setDamage({ itemId: agent.id, track: DamageTrackKey.matrix, value })),
  }
}
