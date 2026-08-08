import IconButton from "@mui/material/IconButton"
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
  | "sustained"
  | "not-sustained"

export interface CardElementStatusIconProps {
  status: CardElementStatusIconStatus
  /**
   * When provided, the icon becomes tappable (e.g. Spell's Sustained toggle) instead of a plain
   * status display — clicks are stopped from bubbling to the card's own `onOpen`.
   */
  onClick?: () => void
}

const statusIcon: Record<CardElementStatusIconStatus, { icon: IconComponent, label: string }> = {
  "equipped": { icon: Icons.item.equipped, label: "Equipped" },
  "stashed": { icon: Icons.item.stashed, label: "Stashed" },
  "fixed": { icon: Icons.item.fixed, label: "Fixed" },
  "wireless-enabled": { icon: Icons.item.wireless.enabled, label: "Wireless" },
  "wireless-disabled": { icon: Icons.item.wireless.disabled, label: "Wireless off" },
  "wireless-removed": { icon: Icons.item.wireless.removed, label: "Wireless removed" },
  "sustained": { icon: Icons.spell.sustained, label: "Sustained" },
  "not-sustained": { icon: Icons.spell.notSustained, label: "Not Sustained" },
}

/**
 * One entry in the top-right status icon cluster, parameterized by `status` rather than a raw
 * icon+label pair — callers pick from known statuses (Item's Equipped/Stashed/Fixed/Wireless,
 * Spell's Sustained/Not Sustained) instead of reinventing the icon/label mapping per consumer,
 * the way `ItemDataCardRoot`'s inline branching did today. Purely a display by default; passing
 * `onClick` makes it tappable (e.g. Spell's Sustained toggle, replacing the old Footer chip).
 */
export const CardElementStatusIcon: FC<CardElementStatusIconProps> = ({ status, onClick }) => {
  const { icon: Icon, label } = statusIcon[status]

  if (!onClick) {
    return (
      <Tooltip title={label}>
        <Icon size={16} aria-label={label} />
      </Tooltip>
    )
  }

  return (
    <Tooltip title={label}>
      <IconButton
        size="small"
        aria-label={label}
        onClick={(event) => {
          event.stopPropagation()
          onClick()
        }}
      >
        <Icon size={16} />
      </IconButton>
    </Tooltip>
  )
}

CardElementStatusIcon.displayName = "EntityCard.StatusIcon"
