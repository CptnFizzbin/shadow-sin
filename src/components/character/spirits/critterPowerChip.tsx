import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { lookupCritterPower } from "#/system/magic/critterPowerData.ts"

interface CritterPowerChipProps {
  name: string
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
  variant?: "filled" | "outlined"
}

export const CritterPowerChip: FC<CritterPowerChipProps> = ({ name, color = "default", variant = "outlined" }) => {
  const [open, setOpen] = useState(false)
  const power = lookupCritterPower(name)

  return (
    <>
      <Chip
        label={name}
        size="small"
        color={color}
        variant={variant}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        sx={{ cursor: "pointer" }}
      />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{name}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            {power?.description ?? "No description available for this power."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
