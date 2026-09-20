import type { FC } from "react"

import { useAddItemDialogContext } from "#/components/entities/items/addItemDialogContext.ts"
import { ItemDetailsRoot } from "#/components/entities/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/entities/items/details/itemDetailsSlot.tsx"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"

import { useAgentFormDialog } from "./dialogs/agentFormDialog.tsx"

export interface AgentItemDetailsProps {
  agent: AgentData
  onRemoved?: () => void
  /** Called with an attached, currently-running Program when its subitem card is tapped. */
  onOpenAttachment?: (item: ItemData) => void
}

export const AgentItemDetails: FC<AgentItemDetailsProps> = ({ agent, onRemoved, onOpenAttachment }) => {
  const dispatch = useRunnerStoreDispatch()
  const agentFormDialog = useAgentFormDialog()
  const addItemDialog = useAddItemDialogContext()
  const runningPrograms = useRunnerSelector(ItemSelectors.selectChildrenOf, { itemId: agent.id })
  const system = agent.attributes[AttributeKey.system] ?? 0
  // Same 8 + Ceil(System / 2) formula as AgentDataCard/damageSlice.selectors.ts's matrix track.
  const damageMax = 8 + Math.ceil(system / 2)

  const removeAgent = () => {
    dispatch(Actions.item.programs.destroy(agent.id))
    onRemoved?.()
  }

  const handleDamageChange = (matrix: number) => {
    const updated: AgentData = { ...agent, damage: { matrix } }
    dispatch(Actions.item.setItem(updated))
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
        <ItemDetailsSlot.Stat label="Firewall" value={agent.attributes[AttributeKey.firewall] ?? 0} type="rating" />

        <ItemDetailsSlot.DamageTrack
          label="Matrix"
          max={damageMax}
          current={agent.damage.matrix}
          onChange={handleDamageChange}
        />

        {Object.values(runningPrograms).map((program) => (
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
