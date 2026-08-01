import Tooltip from "@mui/material/Tooltip"
import type { FC } from "react"

import type { IconComponent } from "#/lib/icons.ts"

export interface DataCardStatusIconProps {
  icon: IconComponent
  label: string
}

/** One entry in the top-right status icon cluster. Collected one-per-status by DataCard. */
export const DataCardSlotStatusIcon: FC<DataCardStatusIconProps> = ({ icon: Icon, label }) => (
  <Tooltip title={label}>
    <Icon size={16} aria-label={label} />
  </Tooltip>
)

DataCardSlotStatusIcon.displayName = "DataCard.StatusIcon"
