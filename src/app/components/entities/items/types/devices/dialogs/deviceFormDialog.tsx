import type { FC } from "react"

import { ItemDialog } from "#/app/components/entities/items/dialogs/itemDialog.tsx"
import { DeviceFormFields } from "#/app/components/entities/items/types/devices/forms/deviceFormFields.tsx"
import { GearFormLicenseSection } from "#/app/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import type { UUID } from "#/common/uuid/uuidUtils.ts"
import type { DeviceData } from "#/data/items/deviceData.ts"
import type { AnyDialogCtrl } from "#/forms/dialog/dialogCtrl.ts"
import { useDialog } from "#/forms/dialog/useDialog.tsx"
import { deviceFieldMap, useDeviceForm } from "#/forms/items/types/devices/useDeviceForm.tsx"

interface DeviceFormDialogProps {
  ctrl: AnyDialogCtrl
  device?: DeviceData
  wizard?: boolean
  parentId?: UUID
}

export const DeviceFormDialog: FC<DeviceFormDialogProps> = ({ ctrl, device, wizard, parentId }) => {
  const title = device ? "Edit Device" : "Add Device"

  const form = useDeviceForm({
    device,
    parentId,
    onSubmit: (submittedDevice) => ctrl.close(submittedDevice),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
      wizard={wizard}
      onClosed={() => form.reset()}
      options={{
        isSubItem: parentId ? { forced: true } : undefined,
      }}
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
