import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import { ProgramFormFields } from "#/components/characterBuilder/sections/gear/devices/forms/programFormFields.tsx"
import {
  programFieldMap,
  useProgramForm,
} from "#/components/characterBuilder/sections/gear/devices/forms/useProgramForm.tsx"
import { useGearByType } from "#/components/gear/useGearApi.ts"
import type { DeviceData } from "#/lib/system/gear/deviceData.ts"
import type { ProgramData } from "#/lib/system/gear/programData.ts"
import { GearType } from "#/lib/system/gearType.ts"

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
  const devices = useGearByType<DeviceData>(GearType.device)

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

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
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
