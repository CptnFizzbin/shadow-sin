import type { FC } from "react"

import { ItemCard } from "#/components/ui/cards/itemCard/itemCard.tsx"
import { useAgentMatrixStats } from "#/hooks/items/types/devices/useAgentMatrixStats.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"

interface AgentDataCardBodyProps {
  agent: AgentData
  onOpen?: () => void
  onEdit?: () => void
}

/** `AgentDataCard`'s actual rendering, reached through `EntityProvider` so `useEntitySelector` resolves against the Agent, not the Runner. */
export const AgentDataCardBody: FC<AgentDataCardBodyProps> = ({ agent, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const { system, firewall, damageMax, runningPrograms, setMatrixDamage } = useAgentMatrixStats(agent)

  const removeAgent = () => dispatch(Actions.item.programs.destroy(agent.id))

  return (
    <ItemCard item={agent} onOpen={onOpen} onEdit={onEdit} onRemove={removeAgent}>
      <ItemCard.Stat label="System" value={system} type="rating" />
      <ItemCard.Stat label="Firewall" value={firewall} type="rating" />

      <ItemCard.Layout.BodyRow>
        <ItemCard.DamageTrack
          label="Matrix"
          max={damageMax}
          current={agent.damage.matrix}
          onChange={setMatrixDamage}
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
