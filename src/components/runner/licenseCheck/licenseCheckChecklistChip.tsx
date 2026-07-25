import Chip from "@mui/material/Chip"
import type { FC } from "react"

export type LicenseCheckChecklistChipState = "queued" | "active" | "clear" | "flagged"

interface LicenseCheckChecklistChipProps {
  label: string
  state: LicenseCheckChecklistChipState
}

export const LicenseCheckChecklistChip: FC<LicenseCheckChecklistChipProps> = ({ label, state }) => {
  const color = state === "clear" ? "success" : state === "flagged" ? "error" : state === "active" ? "info" : "default"

  return (
    <Chip
      size="small"
      label={label}
      color={color}
      variant={state === "queued" ? "outlined" : "filled"}
      sx={{ height: 20, fontSize: "0.65rem" }}
    />
  )
}
