import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { useConfirmDialog } from "#/components/dialogs/confirmDialog.tsx"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"

interface ItemOptionsDialogProps extends ControlledDialogProps<void> {
  initialOptions: Record<string, boolean>
  forced: Record<string, boolean>
  onChange: (updated: Record<string, boolean>) => void
}

const ItemOptionsDialog: FC<ItemOptionsDialogProps> = ({
  ctrl,
  initialOptions,
  forced,
  onChange,
}) => {
  const [pendingUnfix, setPendingUnfix] = useState(false)
  const [options, setOptions] = useState<Record<string, boolean>>(initialOptions)
  const confirmDialog = useConfirmDialog()

  const set = (patch: Record<string, boolean>) => {
    const updated = { ...options, ...patch }
    setOptions(updated)
    onChange(updated)
  }

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
    <ControlledDialog ctrl={ctrl}>
      <Dialog.Title>Item Options</Dialog.Title>

      <Dialog.Content>
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
      </Dialog.Content>
    </ControlledDialog>
  )
}

export type UseItemOptionsDialogProps = Omit<ItemOptionsDialogProps, "ctrl" | "onClose">

export const useItemOptionsDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseItemOptionsDialogProps) => dialogApi.open<void>(
      (ctrl) => <ItemOptionsDialog ctrl={ctrl} {...props} />,
    ),
  }
}
