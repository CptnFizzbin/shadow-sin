import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useAttr } from "#/components/character/characterUtils.ts"
import { Label } from "#/components/ui/text/label.tsx"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

interface SprintDialogProps {
  open: boolean
  sprintBonus: number
  strength: number
  onClose: () => void
  onApply: (bonusMeters: number) => void
}

export const SprintDialog: FC<SprintDialogProps> = ({
  open,
  sprintBonus,
  strength,
  onClose,
  onApply,
}) => {
  const agilityAttr = useAttr(AttributeKey.agility)
  const dicePool = agilityAttr + strength

  const [hits, setHits] = useState(Math.round(sprintBonus / 2))

  const bonusMeters = hits * 2

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Sprint</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <Stack gap={0.5}>
            <Label label="Running Dice Pool" />
            <Typography textAlign="center" variant="h5">
              {dicePool}d6
            </Typography>
            <Typography variant="caption" color="text.secondary" textAlign="center">
              Running (AGI) + STR {agilityAttr} + {strength}
            </Typography>
          </Stack>

          <Stack gap={0.5}>
            <Label label="Hits" />
            <Stack direction="row" alignItems="center" justifyContent="center" gap={2}>
              <Button
                variant="outlined"
                onClick={() => setHits(Math.max(0, hits - 1))}
                disabled={hits <= 0}
                sx={{ minWidth: 40, width: 40, height: 40 }}
              >
                −
              </Button>
              <Typography variant="h5" sx={{ minWidth: 40, textAlign: "center" }}>
                {hits}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setHits(hits + 1)}
                sx={{ minWidth: 40, width: 40, height: 40 }}
              >
                +
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary" textAlign="center">
              +{bonusMeters}m to running speed this round
            </Typography>
          </Stack>

          <Stack direction="row" gap={1}>
            <Button variant="outlined" color="secondary" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                onApply(bonusMeters)
                onClose()
              }}
            >
              Apply
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
