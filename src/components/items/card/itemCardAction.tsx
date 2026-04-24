import type { ButtonProps } from "@mui/material/Button"
import Button from "@mui/material/Button"
import type { IconButtonProps } from "@mui/material/IconButton"
import IconButton from "@mui/material/IconButton"
import type { FC } from "react"

export type ItemCardActionProps =
  | ({ type: "button" } & Omit<ButtonProps, "type">)
  | ({ type: "icon" } & Omit<IconButtonProps, "type">)

/**
 * Action slot for ItemCard.
 * - "icon"   → rendered right of title row (after cost metas)
 * - "button" → rendered full-width below meta rows
 */
export const ItemCardAction: FC<ItemCardActionProps> = ({ type, ...props }) => {
  switch (type) {
    case "icon":
      return <IconButton size="small" {...props} />
    case "button":
    default:
      return <Button {...(props as ButtonProps)} />
  }
}

ItemCardAction.displayName = "ItemCard.Action"
