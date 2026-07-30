import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import { RiArchive2Line, RiCheckboxCircleFill, RiWifiOffLine } from "@remixicon/react"
import type { FC } from "react"

export interface ItemCardStatusIconsProps {
  equipped?: boolean
  stashed?: boolean
  wirelessOff?: boolean
}

/** Top-right status icon cluster for ItemCard: equipped, stashed, wireless-off. */
export const ItemCardStatusIcons: FC<ItemCardStatusIconsProps> = ({
  equipped,
  stashed,
  wirelessOff,
}) => {
  if (!equipped && !stashed && !wirelessOff) return null

  return (
    <Stack direction="row" sx={{ gap: 0.5, flexShrink: 0, alignItems: "center" }}>
      {equipped && (
        <Tooltip title="Equipped">
          <RiCheckboxCircleFill
            size={16}
            style={{ color: "var(--mui-palette-success-main)" }}
            aria-label="Equipped"
          />
        </Tooltip>
      )}

      {stashed && (
        <Tooltip title="Stashed">
          <RiArchive2Line
            size={16}
            style={{ color: "var(--mui-palette-text-secondary)" }}
            aria-label="Stashed"
          />
        </Tooltip>
      )}

      {wirelessOff && (
        <Tooltip title="Wireless off">
          <RiWifiOffLine
            size={16}
            style={{ color: "var(--mui-palette-warning-main)" }}
            aria-label="Wireless off"
          />
        </Tooltip>
      )}
    </Stack>
  )
}
