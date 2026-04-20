import Checkbox from "@mui/material/Checkbox"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import { useConfirmDialog } from "#/components/ui/dialogs/useConfirmDialog.tsx"

export interface ItemOptionFlags {
  equipable: boolean
  licenseRequired: boolean
  licenseAlwaysShow: boolean
  hasRating: boolean
  multiple: boolean
  isSubItem: boolean
  fixed: boolean
  hasEffects: boolean
}

export interface ItemOptionForced {
  equipable?: boolean
  licenseRequired?: boolean
  hasRating?: boolean
  multiple?: boolean
  isSubItem?: boolean
  hasEffects?: boolean
}

interface ItemOptionsDialogProps {
  open: boolean
  onClose: () => void
  options: ItemOptionFlags
  forced: ItemOptionForced
  onChange: (updated: ItemOptionFlags) => void
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

  const set = (patch: Partial<ItemOptionFlags>) => onChange({ ...options, ...patch })

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
            disabled={forced.equipable}
            control={(
              <Checkbox
                checked={options.equipable || (forced.equipable ?? false)}
                onChange={(e) => set({ equipable: e.target.checked })}
              />
            )}
          />

          <FormControlLabel
            label="Has License"
            disabled={forced.licenseRequired}
            control={(
              <Checkbox
                checked={options.licenseRequired || (forced.licenseRequired ?? false)}
                onChange={(e) => set({ licenseRequired: e.target.checked })}
              />
            )}
          />

          <FormControlLabel
            label="Always show license field"
            sx={{ pl: 4 }}
            disabled={forced.licenseRequired}
            control={(
              <Checkbox
                checked={options.licenseAlwaysShow}
                onChange={(e) => set({ licenseAlwaysShow: e.target.checked })}
              />
            )}
          />

          <FormControlLabel
            label="Has rating"
            disabled={forced.hasRating}
            control={(
              <Checkbox
                checked={options.hasRating || (forced.hasRating ?? false)}
                onChange={(e) => set({ hasRating: e.target.checked })}
              />
            )}
          />

          <FormControlLabel
            label="Can have multiple"
            disabled={forced.multiple}
            control={(
              <Checkbox
                checked={options.multiple || (forced.multiple ?? false)}
                onChange={(e) => set({ multiple: e.target.checked })}
              />
            )}
          />

          <FormControlLabel
            label="Is attachment / sub-item"
            disabled={forced.isSubItem}
            control={(
              <Checkbox
                checked={options.isSubItem || (forced.isSubItem ?? false)}
                onChange={(e) => set({ isSubItem: e.target.checked })}
              />
            )}
          />

          <FormControlLabel
            label="Is fixed / integrated item"
            sx={{ pl: 4 }}
            disabled={!options.isSubItem && !forced.isSubItem}
            control={(
              <Checkbox
                checked={options.fixed}
                onChange={(e) => handleFixedChange(e.target.checked)}
              />
            )}
          />

          <FormControlLabel
            label="Applies game effects"
            disabled={forced.hasEffects}
            control={(
              <Checkbox
                checked={options.hasEffects || (forced.hasEffects ?? false)}
                onChange={(e) => set({ hasEffects: e.target.checked })}
              />
            )}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
