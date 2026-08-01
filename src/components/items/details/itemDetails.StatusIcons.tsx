import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import { RiArchive2Line, RiCheckboxCircleFill, RiWifiOffLine } from "@remixicon/react"
import type { FC } from "react"

export interface ItemDetailsStatusIconsProps {
  equipped?: boolean
  stashed?: boolean
  wirelessOff?: boolean
}

/**
 * Status chip row for ItemDetails: equipped, stashed, wireless-off. Labeled
 * chips rather than DataCard's bare icon cluster, since the details page has
 * room to spell status out.
 */
export const ItemDetailsStatusIcons: FC<ItemDetailsStatusIconsProps> = ({
  equipped,
  stashed,
  wirelessOff,
}) => {
  if (!equipped && !stashed && !wirelessOff) return null

  return (
    <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
      {equipped && (
        <Chip size="small" color="success" icon={<RiCheckboxCircleFill size={14} />} label="Equipped" />
      )}
      {stashed && (
        <Chip size="small" icon={<RiArchive2Line size={14} />} label="Stashed" />
      )}
      {wirelessOff && (
        <Chip size="small" color="warning" icon={<RiWifiOffLine size={14} />} label="Wireless off" />
      )}
    </Stack>
  )
}
