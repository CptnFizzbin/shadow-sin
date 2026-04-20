import type { UUID } from "node:crypto"

import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useEffect, useState } from "react"

import { ProgramFormFields } from "#/components/characterBuilder/sections/gear/devices/forms/programFormFields.tsx"
import {
  programFieldMap,
  useProgramForm,
} from "#/components/characterBuilder/sections/gear/devices/forms/useProgramForm.tsx"
import { ItemDialog } from "#/components/gear/dialogs/itemDialog.tsx"
import type { ItemForm } from "#/components/gear/forms/useItemForm.tsx"
import { useGearByType } from "#/components/gear/useGearApi.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ItemType } from "#/system/itemType.ts"

const STORAGE_SENTINEL = "__storage__"

interface ProgramFormDialogProps {
  open: boolean
  program?: ProgramData
  parentId?: UUID
  onClose: () => void
  onClosed?: () => void
  onSave?: (program: ProgramData) => void
}

export const ProgramFormDialog: FC<ProgramFormDialogProps> = ({
  open,
  program,
  parentId,
  onClose,
  onClosed,
  onSave,
}) => {
  const title = program ? "Edit Program" : "Add Program"
  const devices = useGearByType<DeviceData>(ItemType.device)

  const initialDeviceId = program?.parentId ?? parentId ?? STORAGE_SENTINEL
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(initialDeviceId)

  const form = useProgramForm({
    program,
    parentId,
    onSubmit: (submittedProgram) => {
      const resolvedParentId =
        selectedDeviceId === STORAGE_SENTINEL
          ? undefined
          : (selectedDeviceId as UUID)
      onSave?.({ ...submittedProgram, parentId: resolvedParentId })
    },
  })

  // Reset selection and form values when props change so the dialog can be reused
  useEffect(() => {
    const next = program?.parentId ?? parentId ?? STORAGE_SENTINEL
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (next !== selectedDeviceId) setSelectedDeviceId(next)
    // reset form to incoming values when props change (if available)
    if (typeof form.reset === "function") {
      form.reset()
    }
  }, [program, parentId, form, selectedDeviceId])

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
      slots={{
        itemFields: () => (
          <Stack sx={{ gap: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="program-device-label">Device</InputLabel>
              <Select
                labelId="program-device-label"
                label="Device"
                value={selectedDeviceId}
                onChange={(event) => setSelectedDeviceId(event.target.value)}
              >
                <MenuItem value={STORAGE_SENTINEL}>
                  <em>Storage (no device)</em>
                </MenuItem>
                {devices.map((device) => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ProgramFormFields form={form} fields={programFieldMap} />
          </Stack>
        ),
      }}
    />
  )
}
