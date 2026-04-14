import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useIsBuilder } from "#/components/characterBuilder/hooks/useIsBuilder.ts"
import { AvailabilityChip } from "#/components/gear/availabilityChip.tsx"
import { GearAcquireActions } from "#/components/gear/gearAcquireActions.tsx"
import { SinFormFields } from "#/components/licenses/forms/sinFormFields.tsx"
import { sinFieldMap, useSinForm } from "#/components/licenses/forms/useSinForm.tsx"
import { getSinAvailability, getSinCost } from "#/components/licenses/sinUtils.ts"
import type { SinData } from "#/lib/system/gear/sinData.ts"

interface SinFormDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave?: (sin: SinData) => void
  onAcquire?: (sin: SinData) => void
  onPurchase?: (sin: SinData) => void
  onDelete?: () => void
  sin?: SinData
  allowReal?: boolean
}

export const SinFormDialog: FC<SinFormDialogProps> = ({
  open,
  sin,
  allowReal,
  onClose,
  onClosed,
  onSave,
  onAcquire,
  onPurchase,
  onDelete,
}) => {
  const title = sin ? "Edit SIN" : "Create SIN"
  const isBuilder = useIsBuilder()

  const form = useSinForm({
    sin,
    onSubmit: (submittedSin, meta) => {
      if (!isBuilder) {
        if (meta.submitAction === "purchase") {
          onPurchase?.(submittedSin)
        } else {
          onAcquire?.(submittedSin)
        }
      } else {
        onSave?.(submittedSin)
      }
    },
  })

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <SinFormFields
            form={form}
            allowReal={allowReal}
            fields={sinFieldMap}
          />

          <form.Subscribe selector={(state) => state.values.rating}>
            {(rating) => {
              const availability = getSinAvailability(rating)
              return (
                <Stack direction="row" gap={1} flexWrap="wrap">
                  <AvailabilityChip availability={availability} />
                  {sin?.source && (
                    <Chip
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                      label={`${sin.source.book} p.${sin.source.page}`}
                    />
                  )}
                </Stack>
              )
            }}
          </form.Subscribe>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          {onDelete && (
            <Button color="error" onClick={onDelete}>
              Delete
            </Button>
          )}
        </Box>
        {!isBuilder
          ? (
              <form.Subscribe selector={(state) => state.values.rating}>
                {(rating) => {
                  const numericRating = rating === "real" ? ("real" as const) : Number(rating)
                  const cost = getSinCost(numericRating)
                  return (
                    <GearAcquireActions
                      cost={cost}
                      onClose={onClose}
                      onAcquire={() => form.handleSubmit({ submitAction: "acquire" })}
                      onPurchase={() => form.handleSubmit({ submitAction: "purchase" })}
                    />
                  )
                }}
              </form.Subscribe>
            )
          : (
              <>
                <Button color="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="secondary"
                  onClick={() => form.handleSubmit()}
                  variant="contained"
                >
                  Save
                </Button>
              </>
            )}
      </DialogActions>
    </Dialog>
  )
}
