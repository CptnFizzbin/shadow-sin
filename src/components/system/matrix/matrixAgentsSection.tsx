import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { ItemList } from "#/components/entities/items/card/itemList.tsx"
import { AgentDataCard } from "#/components/entities/items/types/devices/agentDataCard.tsx"
import { useAgentFormDialog } from "#/components/entities/items/types/devices/dialogs/agentFormDialog.tsx"
import { useGearListView } from "#/components/entities/items/viewer/gearListFilter.ts"
import { useGearFilter } from "#/hooks/items/gearHooks.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"
import { isAgentData } from "#/system/model/items/agentData.ts"
import { Icons } from "#/utils/icons.ts"

import { useRunProgramDialog } from "./dialogs/runProgramDialog.tsx"

export const MatrixAgentsSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const navigate = useNavigate({ from: "/$runnerId" })
  const agents = useGearFilter(isAgentData)
  const agentFormDialog = useAgentFormDialog()
  const runProgramDialog = useRunProgramDialog()
  const gearListView = useGearListView()

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

        {gearListView(agents).map((agent) => (
          <AgentDataCard
            key={agent.id}
            agent={agent}
            onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: agent.id } })}
            onEdit={() => handleEdit(agent)}
            leftAction={{
              label: "Run",
              icon: <Icons.item.run />,
              onClick: () => runProgramDialog.open({ program: agent }),
            }}
          />
        ))}

        {agentFormDialog.outlet}
        {runProgramDialog.outlet}
      </ItemList>
    </Stack>
  )
}
