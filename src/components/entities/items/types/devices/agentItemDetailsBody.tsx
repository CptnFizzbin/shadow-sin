import type { FC } from "react"

import { useAddItemDialogContext } from "#/components/entities/items/addItemDialogContext.ts"
import { ItemDetailsRoot } from "#/components/entities/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/entities/items/details/itemDetailsSlot.tsx"
import { useAgentMatrixStats } from "#/hooks/items/types/devices/useAgentMatrixStats.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"

import { useAgentFormDialog } from "./dialogs/agentFormDialog.tsx"

export interface AgentItemDetailsBodyProps {
  agent: AgentData
  onRemoved?: () => void
  /** Called with an attached, currently-running Program when its subitem card is tapped. */
  onOpenAttachment?: (item: ItemData) => void
}

/** `AgentItemDetails`'s actual rendering, reached through `EntityProvider` so `useEntitySelector` resolves against the Agent, not the Runner. */
export const AgentItemDetailsBody: FC<AgentItemDetailsBodyProps> = ({ agent, onRemoved, onOpenAttachment }) => {
  const dispatch = useRunnerStoreDispatch()
  const agentFormDialog = useAgentFormDialog()
  const addItemDialog = useAddItemDialogContext()
  const { system, firewall, damageMax, runningPrograms, setMatrixDamage } = useAgentMatrixStats(agent)

  const removeAgent = () => {
    dispatch(Actions.item.programs.destroy(agent.id))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await agentFormDialog.open({ agent })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  const handleAddRunningProgram = () => addItemDialog.open({ parentId: agent.id })

  return (
    <>
      <ItemDetailsRoot
        item={agent}
        onEdit={handleEdit}
        onRemove={removeAgent}
        subitemsName="Running Programs"
        onAddSubitem={handleAddRunningProgram}
      >
        <ItemDetailsSlot.Stat label="Rating" value={agent.rating} type="rating" />
        <ItemDetailsSlot.Stat label="System" value={system} type="rating" />
        <ItemDetailsSlot.Stat label="Firewall" value={firewall} type="rating" />

        <ItemDetailsSlot.DamageTrack
          label="Matrix"
          max={damageMax}
          current={agent.damage.matrix}
          onChange={setMatrixDamage}
        />

        {runningPrograms.map((program) => (
          <ItemDetailsSlot.Subitem
            key={program.id}
            item={program}
            onOpen={onOpenAttachment ? () => onOpenAttachment(program) : undefined}
          />
        ))}
      </ItemDetailsRoot>

      {agentFormDialog.outlet}
    </>
  )
}
