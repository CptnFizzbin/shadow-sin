import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { Icons } from "#/utils/icons.ts"

export interface ItemDetailsSubitemListProps {
  label: string
  /** Text of the add button; the button is only shown when `onAdd` is provided. */
  addLabel?: string
  onAdd?: () => void
  children?: ReactNode
}

/**
 * A labelled list of attached items kept apart from the generic Attachments list (e.g. the
 * Programs loaded on a device), rendered above it with its own add button.
 */
export const ItemDetailsSubitemList: FC<ItemDetailsSubitemListProps> = ({
  label,
  addLabel = "Add Item",
  onAdd,
  children,
}) => (
  <Stack>
    <Label>{label}</Label>
    <Stack>
      {children}

      {onAdd && (
        <Button variant="outlined" startIcon={<Icons.item.add />} onClick={onAdd} fullWidth>
          {addLabel}
        </Button>
      )}
    </Stack>
  </Stack>
)

ItemDetailsSubitemList.displayName = "ItemDetails.SubitemList"
