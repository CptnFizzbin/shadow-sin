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

  /**
   * Returns whether a togglable option's checkbox should appear checked.
   * A forced option is always checked (regardless of local state). A non-forced
   * option reflects the user's local toggle.
   */
  const isChecked = (key: string, value: boolean): boolean =>
    (forced[key] ?? false) ? true : value

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
          <FormControlLabel
            label="Equippable"
            disabled={forced["equipable"]}
            control={(
              <Checkbox
                checked={isChecked("equipable", options["equipable"] ?? false)}
                onChange={(e) => set({ equipable: e.target.checked })}
              />
            )}
          />

          <FormControlLabel
            label="Has rating"
            disabled={forced["hasRating"]}
            control={(
              <Checkbox
                checked={isChecked("hasRating", options["hasRating"] ?? false)}
                onChange={(e) => set({ hasRating: e.target.checked })}
              />
            )}
          />

          <FormControlLabel
            label="Can have multiple"
            disabled={forced["multiple"]}
            control={(
              <Checkbox
                checked={isChecked("multiple", options["multiple"] ?? false)}
                onChange={(e) => set({ multiple: e.target.checked })}
              />
            )}
          />

          <FormControlLabel
            label="Is attachment / sub-item"
            disabled={forced["isSubItem"]}
            control={(
              <Checkbox
                checked={isChecked("isSubItem", options["isSubItem"] ?? false)}
                onChange={(e) => set({ isSubItem: e.target.checked })}
              />
            )}
          />

          <FormControlLabel
            label="Is fixed / integrated item"
            sx={{ pl: 4 }}
            disabled={!(options["isSubItem"] ?? false) && !(forced["isSubItem"] ?? false)}
            control={(
              <Checkbox
                checked={options["fixed"] ?? false}
                onChange={(e) => handleFixedChange(e.target.checked)}
              />
            )}
          />

          <FormControlLabel
            label="Applies game effects"
            disabled={forced["hasEffects"]}
            control={(
              <Checkbox
                checked={isChecked("hasEffects", options["hasEffects"] ?? false)}
                onChange={(e) => set({ hasEffects: e.target.checked })}
              />
            )}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
