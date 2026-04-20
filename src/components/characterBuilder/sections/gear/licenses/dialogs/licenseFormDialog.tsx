import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { LicenseFormFields } from "#/components/characterBuilder/sections/gear/licenses/forms/licenseFormFields.tsx"
import {
  licenseFieldMap,
  useLicenseForm,
} from "#/components/characterBuilder/sections/gear/licenses/forms/useLicenseForm.tsx"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"

export interface LicenseFormDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (data: LicenseData) => void
  license?: LicenseData
  sin?: SinData
}

export const LicenseFormDialog: FC<LicenseFormDialogProps> = ({
  open,
  onClose,
  onClosed,
  onSave,
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
        <Stack sx={{ gap: 1, padding: 1 }}>
          <LicenseFormFields form={form} fields={licenseFieldMap} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: 1 }}>
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
