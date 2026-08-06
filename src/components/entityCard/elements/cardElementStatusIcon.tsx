import Tooltip from "@mui/material/Tooltip"
import type { FC } from "react"

import type { IconComponent } from "#/lib/icons.ts"
import { Icons } from "#/lib/icons.ts"

export type CardElementStatusIconStatus =
  | "equipped"
  | "stashed"
  | "fixed"
  | "wireless-enabled"
  | "wireless-disabled"
  | "wireless-removed"

export interface CardElementStatusIconProps {
  status: CardElementStatusIconStatus
}

const statusIcon: Record<CardElementStatusIconStatus, { icon: IconComponent, label: string }> = {
  "equipped": { icon: Icons.item.equipped, label: "Equipped" },
  "stashed": { icon: Icons.item.stashed, label: "Stashed" },
  "fixed": { icon: Icons.item.fixed, label: "Fixed" },
  "wireless-enabled": { icon: Icons.item.wireless.enabled, label: "Wireless" },
  "wireless-disabled": { icon: Icons.item.wireless.disabled, label: "Wireless off" },
  "wireless-removed": { icon: Icons.item.wireless.removed, label: "Wireless removed" },
}

/**
 * One entry in the top-right status icon cluster, parameterized by `status` rather than a raw
 * icon+label pair — callers pick from Item's known statuses (Equipped/Stashed/Fixed/Wireless)
 * instead of reinventing the icon/label mapping per consumer, the way `ItemDataCardRoot`'s inline
 * branching does today.
 */
export const CardElementStatusIcon: FC<CardElementStatusIconProps> = ({ status }) => {
  const { icon: Icon, label } = statusIcon[status]

  return (
    <Tooltip title={label}>
      <Icon size={16} aria-label={label} />
    </Tooltip>
  )
}

CardElementStatusIcon.displayName = "ItemCard.StatusIcon"
