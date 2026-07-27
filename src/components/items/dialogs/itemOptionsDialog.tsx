import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import type { ItemOptionKey } from "#/lib/hooks/items/dialogs/useItemOptions.ts"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"

interface ItemOptionsDialogProps extends ControlledDialogProps<void> {
  initialOptions: Record<ItemOptionKey, boolean>
  forced: Record<string, boolean>
  onChange: (key: ItemOptionKey, value: boolean) => void
}

const ItemOptionsDialog: FC<ItemOptionsDialogProps> = ({
  ctrl,
  initialOptions,
  forced,
  onChange,
}) => {
  const [pendingUnfix, setPendingUnfix] = useState(false)
  const [options, setOptions] = useState<Record<ItemOptionKey, boolean>>(initialOptions)
  const confirmDialog = useConfirmDialog()

  const set = (key: ItemOptionKey, value: boolean) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
    onChange(key, value)
  }

  const handleFixedChange = async (checked: boolean) => {
    if (checked) {
      set("fixed", true)
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
      set("fixed", false)
    }
  }

  return (
    <ControlledDialog ctrl={ctrl} onClose={false}>
      <Dialog.Title>Item Options</Dialog.Title>

      <Dialog.Content>
        <Stack>
          {!forced["equipable"] && (
            <FormControlLabel
              label="Equippable"
              control={(
                <Checkbox
                  checked={options["equipable"] ?? false}
                  onChange={(e) => set("equipable", e.target.checked)}
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
                  onChange={(e) => set("hasRating", e.target.checked)}
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
                  onChange={(e) => set("multiple", e.target.checked)}
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
                  onChange={(e) => set("isSubItem", e.target.checked)}
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
                  onChange={(e) => set("hasEffects", e.target.checked)}
                />
              )}
            />
          )}
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onClick={() => ctrl.close()}>Done</Button>
      </Dialog.Actions>

      {confirmDialog.dialog}
    </ControlledDialog>
  )
}

type UseItemOptionsDialogProps = Omit<ItemOptionsDialogProps, "ctrl" | "onClose">

export const useItemOptionsDialog = () => useDialog<void, UseItemOptionsDialogProps>(
  (ctrl, props) => <ItemOptionsDialog ctrl={ctrl} {...props} />,
)
