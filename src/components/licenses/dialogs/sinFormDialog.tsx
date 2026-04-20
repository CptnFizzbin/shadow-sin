import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/gear/availabilityChip.tsx"
import { GearAcquireActions } from "#/components/gear/gearAcquireActions.tsx"
import { useItemFormSubmit } from "#/components/gear/useItemFormSubmit.ts"
import { SinFormFields } from "#/components/licenses/forms/sinFormFields.tsx"
import { sinFieldMap, useSinForm } from "#/components/licenses/forms/useSinForm.tsx"
import { getSinAvailability, getSinCost } from "#/components/licenses/sinUtils.ts"
import type { SinData } from "#/system/gear/sinData.ts"

interface SinFormDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (sin: SinData) => void
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
  onDelete,
}) => {
  const title = sin ? "Edit SIN" : "Create SIN"

  const { handleSubmit, isAcquireMode } = useItemFormSubmit({
    mode: sin ? "edit" : "create",
    onSave,
    getItemCost: (s) => getSinCost(s.rating === "real" ? "real" : Number(s.rating)),
  })

  const form = useSinForm({
    sin,
    onSubmit: handleSubmit,
  })

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack sx={{ gap: 1, padding: 1 }}>
          <SinFormFields
            form={form}
            allowReal={allowReal}
            fields={sinFieldMap}
          />

          <form.Subscribe selector={(state) => state.values.rating}>
            {(rating) => {
              const availability = getSinAvailability(rating)
              return (
                <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
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
        {isAcquireMode
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
