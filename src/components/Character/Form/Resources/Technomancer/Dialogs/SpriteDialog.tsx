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
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import type { SpriteFormState } from "#/components/Character/Form/Resources/Technomancer/TechnomancerFormState.ts"

interface SpriteDialogProps {
  open: boolean
  sprite?: SpriteFormState
  resonanceValue: number
  maxTasks: number
  onSave: (sprite: SpriteFormState) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

export const SpriteDialog: FC<SpriteDialogProps> = ({
  open,
  sprite,
  resonanceValue,
  maxTasks,
  onSave,
  onDelete,
  onClose,
  onClosed,
}) => {
  const isEditMode = !!sprite

  const [name, setName] = useState<string>(sprite?.name ?? "")
  const [tasks, setTasks] = useState<number>(sprite?.tasks ?? 1)
  const [nameError, setNameError] = useState(false)

  const effectiveMaxTasks = Math.max(maxTasks, 1)
  const taskOptions = Array.from(
    { length: effectiveMaxTasks },
    (_, index) => index + 1,
  )

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(true)
      return
    }
    onSave({
      id: sprite?.id ?? crypto.randomUUID(),
      name: name.trim(),
      tasks: Math.min(tasks, effectiveMaxTasks),
    })
  }

  const handleClosed = () => {
    setName(sprite?.name ?? "")
    setTasks(sprite?.tasks ?? 1)
    setNameError(false)
    onClosed?.()
  }

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onTransitionExited={handleClosed}
    >
      <DialogTitle>{isEditMode ? "Edit Sprite" : "Add Sprite"}</DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Stack gap={2} sx={{ pt: 1 }}>
          <TextField
            label="Sprite Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNameError(false)
            }}
            error={nameError}
            helperText={nameError ? "Sprite name is required" : undefined}
            size="small"
            fullWidth
            autoFocus
          />

          <TextField
            label="Rating"
            value={resonanceValue}
            size="small"
            fullWidth
            slotProps={{ input: { readOnly: true } }}
            helperText="Sprite rating equals your Resonance"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Tasks</InputLabel>
            <Select
              value={Math.min(tasks, effectiveMaxTasks)}
              label="Tasks"
              onChange={(e) => setTasks(Number(e.target.value))}
            >
              {taskOptions.map((taskOption) => (
                <MenuItem key={taskOption} value={taskOption}>
                  {taskOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {maxTasks === 0 && (
            <Typography variant="caption" color="warning.main">
              Add the Compiling skill to enable sprites with tasks
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <div>
          {onDelete && (
            <Button
              color="error"
              onClick={() => {
                onDelete()
                onClose()
              }}
            >
              Delete
            </Button>
          )}
        </div>
        <div>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
