import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiCloseLine, RiDeleteBinLine } from "@remixicon/react"
import type { FC } from "react"

import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { useItemSelectionMode } from "#/hooks/items/selection/useItemSelection.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ItemBulkStateAction } from "#/system/formulas/items/itemBulkActions.ts"
import {
  canApplyBulkStateAction,
  canRemoveItemOnItsOwn,
  itemBulkStateActions,
} from "#/system/formulas/items/itemBulkActions.ts"
import { ItemStateAction } from "#/system/formulas/items/itemStateRules.ts"
import { Icons } from "#/utils/icons.ts"

const actionLabels: Record<ItemBulkStateAction, string> = {
  [ItemStateAction.stash]: "Stash",
  [ItemStateAction.unstash]: "Unstash",
  [ItemStateAction.equip]: "Equip",
  [ItemStateAction.unequip]: "Unequip",
}

/**
 * The gear list's bulk action bar: how many Items are selected, and Stash, Unstash, Equip, Unequip,
 * and Delete for all of them at once. Each action skips selected Items it doesn't apply to, and
 * any of them ends selection mode once it's done.
 */
export const ItemBulkActionBar: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const selectionMode = useItemSelectionMode()
  const catalog = useRunnerSelector(ItemSelectors.selectAll)
  const confirmDialog = useConfirmDialog()

  const selectedIds = selectionMode.selectedIds.filter((id) => !!catalog[id])
  const removableIds = selectedIds.filter((id) => canRemoveItemOnItsOwn(catalog, id))

  const applyStateAction = (action: ItemBulkStateAction) => {
    dispatch(Actions.item.applyBulkStateAction({ ids: [...selectedIds], action }))
    selectionMode.exit()
  }

  const deleteSelected = async () => {
    const confirmed = await confirmDialog.confirm({
      title: `Delete ${removableIds.length} ${removableIds.length === 1 ? "item" : "items"}?`,
      body: "This removes them and their attachments from your gear. It can't be undone.",
      confirmLabel: "Delete",
    })
    if (!confirmed) return
    dispatch(Actions.item.removeItems({ ids: removableIds }))
    selectionMode.exit()
  }

  return (
    <Paper
      role="toolbar"
      aria-label="Bulk item actions"
      elevation={6}
      sx={{
        padding: 1,
        borderRadius: 2,
        bgcolor: "var(--mui-palette-primary-dark)",
        color: "var(--mui-palette-primary-contrastText)",
      }}
    >
      <Stack sx={{ gap: 0.5 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle2">{selectedIds.length} selected</Typography>
          <IconButton size="small" color="inherit" aria-label="Cancel selection" onClick={selectionMode.exit}>
            <RiCloseLine size={18} />
          </IconButton>
        </Stack>

        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          <ButtonGroup
            variant="contained"
            size="small"
            sx={{ "flexGrow": 1, "& > .MuiButton-root": { flexGrow: 1 } }}
          >
            {itemBulkStateActions.map((action) => {
              const Icon = Icons.item.state[action]
              return (
                <Button
                  key={action}
                  startIcon={<Icon size={14} />}
                  disabled={!selectedIds.some((id) => canApplyBulkStateAction(catalog, id, action))}
                  onClick={() => applyStateAction(action)}
                >
                  {actionLabels[action]}
                </Button>
              )
            })}
          </ButtonGroup>

          <Button
            variant="contained"
            size="small"
            color="error"
            startIcon={<RiDeleteBinLine size={14} />}
            disabled={removableIds.length === 0}
            onClick={deleteSelected}
          >
            Delete
          </Button>
        </Box>
      </Stack>

      {confirmDialog.outlet}
    </Paper>
  )
}
