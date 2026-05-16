import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import type { AttributeKey } from "#/system/attributeKey.ts"
import type { RollType } from "#/system/magic/critterPowerData.ts"
import {
  computeSpiritPowerPool,
  formatSpiritPoolLabel,
  lookupCritterPower,

} from "#/system/magic/critterPowerData.ts"
import { bookOptions } from "#/system/sourceData.ts"

const ROLL_TYPE_COLORS: Record<RollType, "warning" | "info" | "default"> = {
  Opposed: "warning",
  Standard: "info",
  Hidden: "default",
}

interface CritterPowerChipProps {
  name: string
  force?: number
  attrs?: Record<AttributeKey, number>
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
  variant?: "filled" | "outlined"
}

export const CritterPowerChip: FC<CritterPowerChipProps> = ({
  name,
  force,
  attrs,
  color = "default",
  variant = "outlined",
}) => {
  const [open, setOpen] = useState(false)
  const power = lookupCritterPower(name)

  const computedPool =
    power?.spiritPool && force !== undefined && attrs !== undefined
      ? computeSpiritPowerPool(power.spiritPool, force, attrs)
      : undefined

  return (
    <>
      <Chip
        label={computedPool !== undefined ? `${name} [${computedPool}]` : name}
        size="small"
        color={color}
        variant={variant}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        sx={{ cursor: "pointer" }}
      />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm">
        <Dialog.Title>{name}</Dialog.Title>
        <Dialog.Content dividers>
          <Stack sx={{ gap: 1.5 }}>
            {power?.rollType && (
              <Stack direction="row" sx={{ alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={power.rollType}
                  size="small"
                  color={ROLL_TYPE_COLORS[power.rollType]}
                />
                {power.spiritPool && (
                  <Typography variant="body2">
                    <strong>
                      {computedPool !== undefined ? `${computedPool} dice` : formatSpiritPoolLabel(power.spiritPool)}
                    </strong>
                    {computedPool !== undefined && (
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                        ({formatSpiritPoolLabel(power.spiritPool)})
                      </Typography>
                    )}
                    {power.targetPool && ` vs. ${power.targetPool}`}
                  </Typography>
                )}
              </Stack>
            )}
            <Typography variant="body2">
              {power?.description ?? "No description available for this power."}
            </Typography>
            {power?.source && (
              <Typography variant="caption" color="text.secondary">
                {bookOptions.find((b) => b.value === power.source!.book)?.label ?? power.source.book}, p. {power.source.page}
              </Typography>
            )}
          </Stack>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
