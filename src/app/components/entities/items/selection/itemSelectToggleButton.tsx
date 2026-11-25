import type { ButtonProps } from "@mui/material/Button"
import Button from "@mui/material/Button"
import { RiCheckboxMultipleLine, RiCloseLine } from "@remixicon/react"
import type { FC } from "react"

import { useItemSelectionMode } from "#/app/hooks/items/selection/useItemSelection.ts"

type ItemSelectToggleButtonProps = Omit<ButtonProps, "onClick" | "children" | "startIcon">

/**
 * Switches the gear list's selection mode on ("Select") or off ("Cancel"). Renders nothing outside
 * an `ItemSelectionProvider`.
 */
export const ItemSelectToggleButton: FC<ItemSelectToggleButtonProps> = (props) => {
  const selectionMode = useItemSelectionMode()
  if (!selectionMode.isAvailable) return null

  return (
    <Button
      {...props}
      aria-pressed={selectionMode.isSelecting}
      startIcon={selectionMode.isSelecting ? <RiCloseLine size={14} /> : <RiCheckboxMultipleLine size={14} />}
      onClick={selectionMode.isSelecting ? selectionMode.exit : selectionMode.start}
    >
      {selectionMode.isSelecting ? "Cancel" : "Select"}
    </Button>
  )
}
