import type { FC } from "react"

import { ItemCard } from "#/components/ui/cards/itemCard/itemCard.tsx"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"

interface AgentDataCardProps {
  agent: AgentData
  onOpen?: () => void
  onEdit?: () => void
}

export const AgentDataCard: FC<AgentDataCardProps> = ({ agent, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const runningPrograms = useRunnerSelector(ItemSelectors.selectChildrenOf, { itemId: agent.id })
  const hasRunningPrograms = Object.keys(runningPrograms).length > 0
  const system = agent.attributes[AttributeKey.system] ?? 0
  // Same 8 + Ceil(System / 2) formula as a Commlink/Node's Matrix condition monitor
  // (damageSlice.selectors.ts's matrix track) — System stands in for the Body/Willpower a
  // Runner's own tracks use.
  const damageMax = 8 + Math.ceil(system / 2)

  const removeAgent = () => dispatch(Actions.item.programs.destroy(agent.id))

  const handleDamageChange = (matrix: number) => {
    const updated: AgentData = { ...agent, damage: { matrix } }
    dispatch(Actions.item.setItem(updated))
  }

  return (
    <ItemCard item={agent} onOpen={onOpen} onEdit={onEdit} onRemove={removeAgent}>
      <ItemCard.Stat label="System" value={system} type="rating" />
      <ItemCard.Stat label="Firewall" value={agent.attributes[AttributeKey.firewall] ?? 0} type="rating" />

      <ItemCard.Layout.BodyRow>
        <ItemCard.DamageTrack
          label="Matrix"
          max={damageMax}
          current={agent.damage.matrix}
          onChange={handleDamageChange}
        />
      </ItemCard.Layout.BodyRow>

      {hasRunningPrograms && (
        <ItemCard.Layout.BodyRow
          direction="column"
          sx={{ gap: 0.25, paddingLeft: 1, borderLeft: "2px solid", borderColor: "secondary.dark" }}
        >
          {Object.values(runningPrograms).map((program) => (
            <ItemCard.Subitem key={program.id} name={program.name} />
          ))}
        </ItemCard.Layout.BodyRow>
      )}
    </ItemCard>
  )
}
