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
import { LicenseFormFields } from "#/components/licenses/forms/licenseFormFields.tsx"
import {
  licenseFieldMap,
  useLicenseForm,
} from "#/components/licenses/forms/useLicenseForm.tsx"
import { getLicenseAvailability } from "#/components/licenses/licenseUtils.ts"
import type { LicenseData } from "#/lib/system/gear/licenseData.ts"
import type { SinData } from "#/lib/system/gear/sinData.ts"

export interface LicenseFormDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (data: LicenseData) => void
  onDelete?: () => void
  license?: LicenseData
  sin?: SinData
}

export const LicenseFormDialog: FC<LicenseFormDialogProps> = ({
  open,
  onClose,
  onClosed,
  onSave,
  onDelete,
  license,
  sin,
}) => {
  const form = useLicenseForm({
    license: license,
    parentId: sin?.id,
    sinReal: sin?.rating === "real" || false,
    onSubmit: onSave,
  })

  const title = license ? "Edit License" : "Create License"

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <LicenseFormFields form={form} fields={licenseFieldMap} />

          <form.Subscribe selector={(state) => state.values.rating}>
            {(rating) => {
              const availability = getLicenseAvailability(rating)
              return (
                <Stack direction="row" gap={1} flexWrap="wrap">
                  <AvailabilityChip availability={availability} />
                  {license?.source && (
                    <Chip
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                      label={`${license.source.book} p.${license.source.page}`}
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
