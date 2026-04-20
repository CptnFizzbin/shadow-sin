import type { FC } from "react"

import {
  DeviceFormFields,
} from "#/components/characterBuilder/sections/gear/devices/forms/deviceFormFields.tsx"
import {
  deviceFieldMap,
  useDeviceForm,
} from "#/components/characterBuilder/sections/gear/devices/forms/useDeviceForm.tsx"
import { ItemDialog } from "#/components/gear/dialogs/itemDialog.tsx"
import type { ItemForm } from "#/components/gear/forms/useItemForm.tsx"
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
      form={form as unknown as ItemForm}
      title={title}
      open={open}
      onClose={onClose}
      onClosed={() => {
        form.reset()
        onClosed?.()
      }}
      options={{
        hasEffects: { forced: true },
      }}
      slots={{
        itemFields: () => <DeviceFormFields form={form} fields={deviceFieldMap} />,
      }}
    />
  )
}
