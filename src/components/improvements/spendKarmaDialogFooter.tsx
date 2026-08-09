import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"
import { KarmaValue } from "#/components/runner/karma/karmaValue.tsx"
import { useSpendKarmaSummary } from "#/lib/hooks/improvements/useSpendKarmaSummary.ts"

interface SpendKarmaDialogFooterProps {
  onCancel: () => void
  onSave: () => void
}

/**
 * Budget summary + Cancel/Save row for the Spend Karma dialog. Wraps to two
 * rows when horizontal space runs out instead of overflowing.
 */
export const SpendKarmaDialogFooter: FC<SpendKarmaDialogFooterProps> = ({ onCancel, onSave }) => {
  const { remainingKarma, karmaCost, isOverBudget, canSave } = useSpendKarmaSummary()

  return (
    <Stack
      direction="row"
      sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", width: "100%" }}
    >
      <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
        <Typography variant="caption" color="text.secondary">Remaining</Typography>
        <KarmaChip
          amount={remainingKarma}
          color={isOverBudget ? "error" : karmaCost > 0 ? "primary" : "default"}
        />
        {karmaCost > 0 && (
          <>
            <Divider orientation="vertical" flexItem />
            <Typography variant="caption" color="text.secondary">Cost</Typography>
            <KarmaValue amount={karmaCost} sx={{ fontWeight: "bold" }} />
          </>
        )}
      </Stack>

      <Stack direction="row" sx={{ ml: "auto" }}>
        <Button color="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="contained" color="secondary" disabled={!canSave} onClick={onSave}>
          Save
        </Button>
      </Stack>
    </Stack>
  )
}
