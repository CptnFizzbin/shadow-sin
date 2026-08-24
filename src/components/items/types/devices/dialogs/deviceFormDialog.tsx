import type { FC } from "react"

import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { DeviceFormFields } from "#/components/items/types/devices/forms/deviceFormFields.tsx"
import { GearFormLicenseSection } from "#/components/items/types/licenses/gearFormLicenseSection.tsx"
import type { AnyDialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { deviceFieldMap, useDeviceForm } from "#/hooks/items/types/devices/forms/useDeviceForm.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
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
        itemFields: () => (
          <>
            <DeviceFormFields form={form} fields={deviceFieldMap} />
            <GearFormLicenseSection form={form} />
          </>
        ),
      }}
    />
  )
}

type UseDeviceFormDialogProps = Omit<DeviceFormDialogProps, "ctrl">

export const useDeviceFormDialog = () => useDialog<DeviceData, UseDeviceFormDialogProps | undefined>(
  (ctrl, props) => <DeviceFormDialog ctrl={ctrl} {...props} />,
)
