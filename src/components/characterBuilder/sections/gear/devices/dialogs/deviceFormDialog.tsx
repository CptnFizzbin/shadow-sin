import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { DeviceFormFields } from "#/components/characterBuilder/sections/gear/devices/forms/deviceFormFields.tsx"
import {
  deviceFieldMap,
  useDeviceForm,
} from "#/components/characterBuilder/sections/gear/devices/forms/useDeviceForm.tsx"
import type { DeviceData } from "#/lib/system/gear/deviceData.ts"

interface DeviceFormDialogProps {
  open: boolean
  device?: DeviceData
  onClose: () => void
  onClosed?: () => void
  onSave?: (device: DeviceData) => void
}

export const DeviceFormDialog: FC<DeviceFormDialogProps> = ({
  open,
  device,
  onClose,
  onClosed,
  onSave,
}) => {
  const title = device ? "Edit Device" : "Add Device"

  const form = useDeviceForm({
    device,
    onSubmit: (submittedDevice) => {
      onSave?.(submittedDevice)
    },
  })

  return (
    <Dialog
      open={open}
      fullWidth
      onClose={onClose}
      onTransitionExited={() => {
        form.reset()
        onClosed?.()
      }}
    >
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <DeviceFormFields form={form} fields={deviceFieldMap} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          onClick={() => form.handleSubmit()}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
