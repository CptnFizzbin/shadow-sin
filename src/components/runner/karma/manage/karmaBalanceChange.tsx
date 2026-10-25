import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowRightLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"

interface KarmaBalanceChangeProps {
  label: string
  before: ReactNode
  after: ReactNode
  /** Highlights `after` as an error, e.g. when it can't be afforded. */
  isInvalid?: boolean
}

/** One "label: before → after" row previewing how a Manage Karma step changes a balance. */
export const KarmaBalanceChange: FC<KarmaBalanceChangeProps> = ({ label, before, after, isInvalid }) => (
  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
      <Typography variant="body2" component="div">{before}</Typography>
      <RiArrowRightLine size={14} style={{ color: "var(--mui-palette-text-secondary)" }} />
      <Typography
        variant="body2"
        component="div"
        color={isInvalid ? "error" : undefined}
        sx={{ fontWeight: "bold" }}
      >
        {after}
      </Typography>
    </Stack>
  </Stack>
)
