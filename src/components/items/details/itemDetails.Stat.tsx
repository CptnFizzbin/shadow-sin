import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { Theme } from "@mui/material/styles"
import type { FC } from "react"

export type ItemDetailsStatType =
  | "damage"
  | "modifier"
  | "rating"
  | "restriction"
  | "warning"
  | "forbidden"

export interface ItemDetailsStatProps {
  label?: string
  value: string | number
  type?: ItemDetailsStatType
}

const typeColor: Partial<Record<ItemDetailsStatType, (theme: Theme) => string>> = {
  damage: (theme) => theme.palette.secondary.main,
  modifier: (theme) => theme.palette.info.main,
  rating: (theme) => theme.palette.primary.main,
  warning: (theme) => theme.palette.warning.main,
  forbidden: (theme) => theme.palette.error.main,
}

/**
 * Labeled stat block for ItemDetails — full label and a large value, unlike
 * the condensed chip ItemCard.Stat uses. `type` drives the value's color.
 */
export const ItemDetailsStat: FC<ItemDetailsStatProps> = ({ label, value, type }) => (
  <Stack sx={{ minWidth: 64, gap: 0.25 }}>
    {label && (
      <Typography
        sx={{ fontSize: "0.7rem", color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        {label}
      </Typography>
    )}
    <Typography
      sx={{
        fontSize: "1.25rem",
        fontWeight: 600,
        color: (theme) => (type ? typeColor[type]?.(theme) : theme.palette.text.primary),
      }}
    >
      {value}
    </Typography>
  </Stack>
)

ItemDetailsStat.displayName = "ItemDetails.Stat"
