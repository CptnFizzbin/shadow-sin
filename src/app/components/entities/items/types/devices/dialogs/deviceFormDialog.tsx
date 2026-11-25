import type { FC } from "react"

import { ItemDialog } from "#/components/entities/items/dialogs/itemDialog.tsx"
import { DeviceFormFields } from "#/components/entities/items/types/devices/forms/deviceFormFields.tsx"
import { GearFormLicenseSection } from "#/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import { deviceFieldMap, useDeviceForm } from "#/hooks/items/types/devices/forms/useDeviceForm.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { AnyDialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import type { DeviceData } from "#/system/model/items/deviceData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

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
