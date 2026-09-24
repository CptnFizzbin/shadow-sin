import type { FC } from "react"

import { ItemCard } from "#/components/ui/cards/itemCard/itemCard.tsx"
import { useEntitySelector } from "#/hooks/entity/useEntitySelector.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { DamageSelectors } from "#/state/runner/damage/damage.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { DamageTrackKey } from "#/system/model/entities/damageTrackKey.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"

interface AgentDataCardBodyProps {
  agent: AgentData
  onOpen?: () => void
  onEdit?: () => void
}

/** `AgentDataCard`'s actual rendering, reached through `EntityProvider` so `useEntitySelector` resolves against the Agent, not the Runner. */
export const AgentDataCardBody: FC<AgentDataCardBodyProps> = ({ agent, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const system = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.system })
  const firewall = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.firewall })
  const damageMax = useEntitySelector(DamageSelectors.selectMatrixMax)
  const runningPrograms = useRunnerSelector(ItemSelectors.selectChildListOf, { itemId: agent.id })

  const removeAgent = () => dispatch(Actions.item.programs.destroy(agent.id))

  const handleDamageChange = (value: number) =>
    dispatch(Actions.item.setDamage({ itemId: agent.id, track: DamageTrackKey.matrix, value }))

  return (
    <ItemCard item={agent} onOpen={onOpen} onEdit={onEdit} onRemove={removeAgent}>
      <ItemCard.Stat label="System" value={system} type="rating" />
      <ItemCard.Stat label="Firewall" value={firewall} type="rating" />

      <ItemCard.Layout.BodyRow>
        <ItemCard.DamageTrack
          label="Matrix"
          max={damageMax}
          current={agent.damage.matrix}
          onChange={handleDamageChange}
        />
      </ItemCard.Layout.BodyRow>

      {runningPrograms.length > 0 && (
        <ItemCard.Layout.BodyRow
          direction="column"
          sx={{ gap: 0.25, paddingLeft: 1, borderLeft: "2px solid", borderColor: "secondary.dark" }}
        >
          {runningPrograms.map((program) => (
            <ItemCard.Subitem key={program.id} name={program.name} />
          ))}
        </ItemCard.Layout.BodyRow>
      )}
    </ItemCard>
  )
}
