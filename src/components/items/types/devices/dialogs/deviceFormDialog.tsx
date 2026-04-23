import type { FC } from "react"

import {
  DeviceFormFields,
} from "#/components/items/types/devices/forms/deviceFormFields.tsx"
import {
  deviceFieldMap,
  useDeviceForm,
} from "#/components/items/types/devices/forms/useDeviceForm.tsx"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import type { DeviceData } from "#/system/gear/deviceData.ts"

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
    <ItemDialog
      form={form}
      title={title}
      open={open}
      onClose={onClose}
      onClosed={() => {
        form.reset()
        onClosed?.()
      }}
      slots={{
        itemFields: () => <DeviceFormFields form={form} fields={deviceFieldMap} />,
      }}
    />
  )
}
