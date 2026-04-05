import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/Gear/availability-chip.tsx"
import { SinFormFields } from "#/components/Licenses/Forms/sin-form-fields.tsx"
import { sinFieldMap, useSinForm } from "#/components/Licenses/Forms/use-sin-form.tsx"
import { getSinAvailability } from "#/components/Licenses/sin-utils.ts"
import type { SinData } from "#/lib/system/gear/sin-data.ts"

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
  const form = useSinForm({ sin, onSubmit: onSave })

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
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          color="secondary"
          onClick={form.handleSubmit}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
