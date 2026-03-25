import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { LicenseFormFields } from "#/components/CharacterBuilder/Gear/Licenses/Forms/LicenseFormFields.tsx"
import {
  licenseFieldMap,
  useLicenseForm,
} from "#/components/CharacterBuilder/Gear/Licenses/Forms/UseLicenseForm.tsx"
import type { LicenseData } from "#/lib/system/types/gear/licenseData.ts"

export interface LicenseFormDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (data: LicenseData) => void
  license?: LicenseData
  sinReal?: boolean
}

export const LicenseFormDialog: FC<LicenseFormDialogProps> = ({
  open,
  onClose,
  onClosed,
  onSave,
  license,
  sinReal = false,
}) => {
  const editMode = !!license

  const form = useLicenseForm(
    editMode
      ? { mode: "edit", license, onSubmit: onSave }
      : { mode: "create", sinReal, onSubmit: onSave },
  )

  const title = editMode ? "Edit License" : "Create License"

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <LicenseFormFields
            form={form}
            sinReal={sinReal}
            fields={licenseFieldMap}
          />
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
