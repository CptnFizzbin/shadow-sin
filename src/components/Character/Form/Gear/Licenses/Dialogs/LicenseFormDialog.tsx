import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { LicenseFormFields } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormFields.tsx"
import type { LicenseFormState } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/Character/Form/Gear/Licenses/Forms/SinFormState.ts"
import type { LicenseFormOptions } from "#/components/Character/Form/Gear/Licenses/Forms/UseLicenseForm.tsx"
import {
  licenseFieldMap,
  useLicenseForm,
} from "#/components/Character/Form/Gear/Licenses/Forms/UseLicenseForm.tsx"

export interface LicenseFormDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (data: LicenseFormState) => void
  mode?: "create" | "edit"
  license?: LicenseFormState
  sinId?: string
  sins?: SinFormState[]
}

export const LicenseFormDialog: FC<LicenseFormDialogProps> = ({
  open,
  onClose,
  onClosed,
  onSave,
  mode = "create",
  license,
  sinId,
  sins = [],
}) => {
  const selectedSin = sins.find(
    (sin) => sin.id === (license ? license.sinId : sinId),
  )

  const options: LicenseFormOptions =
    mode === "edit" && license
      ? {
          mode: "edit",
          license: license,
          onSubmit: onSave,
        }
      : {
          mode: "create",
          sinId: sinId ?? "",
          sinReal: selectedSin ? selectedSin.rating === "real" : false,
          onSubmit: onSave,
        }

  const form = useLicenseForm(options)

  const title = mode === "edit" ? "Edit License" : "Create License"

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <LicenseFormFields form={form} sins={sins} fields={licenseFieldMap} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={form.handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
