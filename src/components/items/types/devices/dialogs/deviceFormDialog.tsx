import type { FC } from "react"

import {
  CharacterSheetProvider,
  useCharacterSheetContext,
} from "#/components/character/sheet/characterSheetProvider.tsx"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import {
  DeviceFormFields,
} from "#/components/items/types/devices/forms/deviceFormFields.tsx"
import {
  deviceFieldMap,
  useDeviceForm,
} from "#/components/items/types/devices/forms/useDeviceForm.tsx"
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

export type UseDeviceFormDialogProps = Omit<DeviceFormDialogProps, "open" | "onClose" | "onClosed" | "onSave">

export const useDeviceFormDialog = () => {
  const dialogApi = useDialogApi()
  const sheetContext = useCharacterSheetContext()

  return {
    open: (props?: UseDeviceFormDialogProps) => dialogApi.open<DeviceData>(
      (dialogProps) => (
        <CharacterSheetProvider store={sheetContext}>
          <DeviceFormDialog
            {...dialogProps}
            {...props}
            onSave={(device) => dialogProps.onClose(device)}
          />
        </CharacterSheetProvider>
      ),
    ),
  }
}
