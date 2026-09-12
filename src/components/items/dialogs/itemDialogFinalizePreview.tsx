import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import type { ItemData } from "#/system/itemData.ts"

interface ItemDialogFinalizePreviewProps {
  values: ItemData
  showRating: boolean
  showCost: boolean
  showAvailability: boolean
}

/**
 * Read-only summary of the in-progress item, shown on the wizard's Finalize step so a
 * Player can review what they're about to acquire before confirming.
 */
export const ItemDialogFinalizePreview: FC<ItemDialogFinalizePreviewProps> = ({
  values,
  showRating,
  showCost,
  showAvailability,
}) => {
  const totalCost = (values.cost ?? 0) * (values.quantity ?? 1)
  const effectCount = values.effects?.length ?? 0

  return (
    <Paper variant="outlined" sx={{ padding: 1.5 }}>
      <Stack sx={{ gap: 1 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">
            {values.name || "Unnamed Item"}
            {showRating && values.rating ? ` (Rating ${values.rating})` : ""}
          </Typography>

          {showAvailability && values.availability && (
            <AvailabilityChip availability={values.availability} />
          )}
        </Stack>

        {(values.quantity ?? 1) > 1 && (
          <Typography variant="body2" color="text.secondary">
            {`Quantity: ${values.quantity}`}
          </Typography>
        )}

        {showCost && (
          <Typography variant="body2" color="text.secondary">
            Total Cost:
            {" "}
            <Nuyen amount={totalCost} />
          </Typography>
        )}

        {values.description && (
          <Typography variant="body2">{values.description}</Typography>
        )}

        {values.source?.book && (
          <Typography variant="caption" color="text.secondary">
            {`${values.source.book}${values.source.page ? ` p.${values.source.page}` : ""}`}
          </Typography>
        )}

        {effectCount > 0 && (
          <>
            <Divider />
            <Typography variant="body2" color="text.secondary">
              {`${effectCount} Game Effect${effectCount === 1 ? "" : "s"}`}
            </Typography>
          </>
        )}
      </Stack>
    </Paper>
  )
}
