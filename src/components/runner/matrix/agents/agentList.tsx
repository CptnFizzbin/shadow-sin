import type { FC } from "react"

import { ItemList } from "#/components/items/card/itemList.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { AgentData } from "#/system/matrix/agentData.ts"
import { AgentDataSchema } from "#/system/matrix/agentData.ts"

import { AgentDataCard } from "./agentDataCard.tsx"
import { useAgentFormDialog } from "./dialogs/agentFormDialog.tsx"

export const AgentList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const agents = useRunnerStoreSelector(Selectors.agents.selectAgents)
  const agentFormDialog = useAgentFormDialog()
  const confirmDialog = useConfirmDialog()

  const handleEdit = async (agent?: AgentData) => {
    const saved = await agentFormDialog.open({ agent })
    if (saved) dispatch(Actions.agents.saveAgent(AgentDataSchema.parse(saved)))
  }

  const handleRemove = async (agent: AgentData) => {
    if (await confirmDialog.confirm({
      title: `Remove ${agent.name}?`,
      body: "Are you sure you want to remove this agent? This action cannot be undone.",
      confirmLabel: "Remove",
    })) {
      dispatch(Actions.agents.removeAgent(agent.id))
    }
  }

  return (
    <ItemList>
      <ItemList.AddItemButton onClick={() => handleEdit()}>Add Agent</ItemList.AddItemButton>

      {agents.map((agent) => (
        <AgentDataCard
          key={agent.id}
          agent={agent}
          onEdit={() => handleEdit(agent)}
          onRemove={() => handleRemove(agent)}
        />
      ))}

      {agentFormDialog.dialog}
      {confirmDialog.dialog}
    </ItemList>
  )
}
