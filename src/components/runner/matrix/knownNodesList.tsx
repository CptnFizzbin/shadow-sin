import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { ItemList } from "#/components/items/card/itemList.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { KnownNode } from "#/system/matrix/knownNode.ts"

import { useKnownNodeFormDialog } from "./dialogs/knownNodeFormDialog.tsx"
import { MatrixNodeCard } from "./matrixNodeCard.tsx"

export const KnownNodesList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const knownNodes = useRunnerStoreSelector(Selectors.gameState.matrix.selectKnownNodes)
  const activeNodeId = useRunnerStoreSelector(Selectors.gameState.matrix.selectActiveNodeId)
  const confirmDialog = useConfirmDialog()
  const knownNodeFormDialog = useKnownNodeFormDialog()

  const handleRemove = async (node: KnownNode) => {
    if (await confirmDialog.confirm({
      title: `Remove ${node.name}?`,
      body: "Are you sure you want to remove this Known Node? This action cannot be undone.",
      confirmLabel: "Remove",
    })) {
      dispatch(Actions.gameState.matrix.removeKnownNode(node.id))
    }
  }

  return (
    <Stack>
      <Typography>Known Nodes</Typography>

      {knownNodes.length === 0 && (
        <Typography color="text.secondary" sx={{ pl: 1 }}>
          No Known Nodes yet
        </Typography>
      )}

      {knownNodes.map((node) => (
        <MatrixNodeCard
          key={node.id}
          node={node}
          isActive={node.id === activeNodeId}
          onEdit={() => knownNodeFormDialog.open({ node })}
          onRemove={() => handleRemove(node)}
          onSetActive={() => dispatch(Actions.gameState.matrix.setActiveNode(node.id))}
          onDeactivate={() => dispatch(Actions.gameState.matrix.clearActiveNode())}
        />
      ))}

      <ItemList.AddItemButton onClick={() => knownNodeFormDialog.open()}>Add Known Node</ItemList.AddItemButton>

      {confirmDialog.dialog}
      {knownNodeFormDialog.dialog}
    </Stack>
  )
}
