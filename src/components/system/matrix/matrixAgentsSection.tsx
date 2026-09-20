import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { ItemList } from "#/components/entities/items/card/itemList.tsx"
import { AgentDataCard } from "#/components/entities/items/types/devices/agentDataCard.tsx"
import { useAgentFormDialog } from "#/components/entities/items/types/devices/dialogs/agentFormDialog.tsx"
import { useGearFilter } from "#/hooks/items/gearHooks.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"
import { isAgentData } from "#/system/model/items/agentData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"

export const MatrixAgentsSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const navigate = useNavigate({ from: "/$runnerId" })
  const agents = useGearFilter((item): item is AgentData =>
    item.itemType === ItemType.program && isAgentData(item as ProgramData))
  const agentFormDialog = useAgentFormDialog()

  const handleEdit = async (agent?: AgentData) => {
    const saved = await agentFormDialog.open({ agent })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <Stack>
      <Typography>Agents</Typography>

      {agents.length === 0 && (
        <Typography color="text.secondary" sx={{ pl: 1 }}>
          No Agents yet
        </Typography>
      )}

      <ItemList>
        <ItemList.AddItemButton onClick={() => handleEdit()}>Add Agent</ItemList.AddItemButton>

        {agents.map((agent) => (
          <AgentDataCard
            key={agent.id}
            agent={agent}
            onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: agent.id } })}
            onEdit={() => handleEdit(agent)}
          />
        ))}

        {agentFormDialog.outlet}
      </ItemList>
    </Stack>
  )
}
