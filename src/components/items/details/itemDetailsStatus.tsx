import type { ChipProps } from "@mui/material/Chip"
import Chip from "@mui/material/Chip"
import type { ComponentClass, FC } from "react"

export interface ItemDetailsStatusIconsProps {
  icon: ComponentClass<{ size?: string | number }, unknown> | FC<{ size?: string | number }>
  label: string
  color?: ChipProps["color"]
}

export const ItemDetailsStatus: FC<ItemDetailsStatusIconsProps> = ({
  icon: Icon,
  label,
  color,
}) => {
  return <Chip size="small" color={color} icon={<Icon size={14} />} label={label} />
}
