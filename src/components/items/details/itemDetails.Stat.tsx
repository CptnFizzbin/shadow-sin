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
 * the condensed chip DataCard.Stat uses. `type` drives the value's color.
 */
export const ItemDetailsStat: FC<ItemDetailsStatProps> = ({ label, value, type }) => (
  <Stack
    sx={{
      gap: 0.25,
      flexGrow: 1,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      padding: 1,
    }}
  >
    {label && (
      <Typography sx={{ color: "text.secondary", textTransform: "uppercase" }}>
        {label}
      </Typography>
    )}
    <Typography
      sx={{
        fontWeight: 600,
        color: (theme) => (type ? typeColor[type]?.(theme) : undefined),
      }}
    >
      {value}
    </Typography>
  </Stack>
)

ItemDetailsStat.displayName = "ItemDetails.Stat"
