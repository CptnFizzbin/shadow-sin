import type { FC } from "react"

import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { DeviceFormFields } from "#/components/items/types/devices/forms/deviceFormFields.tsx"
import { deviceFieldMap, useDeviceForm } from "#/components/items/types/devices/forms/useDeviceForm.tsx"
import { useDialogApi } from "#/components/ui/dialog/api/dialogApiProvider.tsx"
import type { AnyDialogCtrl } from "#/components/ui/dialog/api/dialogCtrl.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"

interface DeviceFormDialogProps {
  ctrl: AnyDialogCtrl
  device?: DeviceData
}

export const DeviceFormDialog: FC<DeviceFormDialogProps> = ({ ctrl, device }) => {
  const title = device ? "Edit Device" : "Add Device"

  const form = useDeviceForm({
    device,
    onSubmit: (submittedDevice) => ctrl.close(submittedDevice),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
      onClosed={() => form.reset()}
      slots={{
        itemFields: () => <DeviceFormFields form={form} fields={deviceFieldMap} />,
      }}
    />
  )
}

type UseDeviceFormDialogProps = Omit<DeviceFormDialogProps, "ctrl">

export const useDeviceFormDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseDeviceFormDialogProps) => dialogApi.open<DeviceData>(
      (ctrl) => <DeviceFormDialog ctrl={ctrl} {...props} />,
    ),
  }
}
