import Checkbox from "@mui/material/Checkbox"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import { useConfirmDialog } from "#/components/ui/dialogs/useConfirmDialog.tsx"

interface ItemOptionsDialogProps {
  open: boolean
  onClose: () => void
  options: Record<string, boolean>
  forced: Record<string, boolean>
  onChange: (updated: Record<string, boolean>) => void
}

export const ItemOptionsDialog: FC<ItemOptionsDialogProps> = ({
  open,
  onClose,
  options,
  forced,
  onChange,
}) => {
  const [pendingUnfix, setPendingUnfix] = useState(false)
  const confirmDialog = useConfirmDialog({ id: "item-unfix-confirm" })

  const set = (patch: Record<string, boolean>) => onChange({ ...options, ...patch })

  const handleFixedChange = async (checked: boolean) => {
    if (checked) {
      set({ fixed: true })
      return
    }

    if (pendingUnfix) return
    setPendingUnfix(true)
    const confirmed = await confirmDialog.confirm({
      title: "Make item removable?",
      body: "This item is integrated into its parent and cannot be removed. Are you sure you want to make it removable?",
      confirmLabel: "Make Removable",
    })
    setPendingUnfix(false)
    if (confirmed) {
      set({ fixed: false })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle sx={{ padding: 1 }}>Item Options</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack>
          {!forced["equipable"] && (
            <FormControlLabel
              label="Equippable"
              control={(
                <Checkbox
                  checked={options["equipable"] ?? false}
                  onChange={(e) => set({ equipable: e.target.checked })}
                />
              )}
            />
          )}

          {!forced["hasRating"] && (
            <FormControlLabel
              label="Has rating"
              control={(
                <Checkbox
                  checked={options["hasRating"] ?? false}
                  onChange={(e) => set({ hasRating: e.target.checked })}
                />
              )}
            />
          )}

          {!forced["multiple"] && (
            <FormControlLabel
              label="Can have multiple"
              control={(
                <Checkbox
                  checked={options["multiple"] ?? false}
                  onChange={(e) => set({ multiple: e.target.checked })}
                />
              )}
            />
          )}

          {/* Show isSubItem row only when it is user-toggleable. */}
          {!forced["isSubItem"] && (
            <FormControlLabel
              label="Is attachment / sub-item"
              control={(
                <Checkbox
                  checked={options["isSubItem"] ?? false}
                  onChange={(e) => set({ isSubItem: e.target.checked })}
                />
              )}
            />
          )}

          {/* Show fixed row when isSubItem is user-toggleable or forced-on (options["isSubItem"] is true). */}
          {(!forced["isSubItem"] || options["isSubItem"]) && (
            <FormControlLabel
              label="Is fixed / integrated item"
              sx={{ pl: 4 }}
              disabled={!options["isSubItem"]}
              control={(
                <Checkbox
                  checked={options["fixed"] ?? false}
                  onChange={(e) => handleFixedChange(e.target.checked)}
                />
              )}
            />
          )}

          {!forced["hasEffects"] && (
            <FormControlLabel
              label="Applies game effects"
              control={(
                <Checkbox
                  checked={options["hasEffects"] ?? false}
                  onChange={(e) => set({ hasEffects: e.target.checked })}
                />
              )}
            />
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
