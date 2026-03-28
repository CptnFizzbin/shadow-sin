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

import type { SpriteFormState } from "#/components/CharacterBuilder/Sections/Resources/AwakenedFormState.ts"
import { useMaxSpriteTasks } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/SpritesHooks.ts"

interface SpriteDialogProps {
  open: boolean
  sprite?: SpriteFormState
  onSave: (sprite: SpriteFormState) => void
  onClose: () => void
  onClosed?: () => void
}

export const SpriteDialog: FC<SpriteDialogProps> = ({
  open,
  sprite,
  onSave,
  onClose,
  onClosed,
}) => {
  const maxSpriteTasks = useMaxSpriteTasks()
  const isEditMode = !!sprite

  const [name, setName] = useState<string>(sprite?.name ?? "")
  const [tasks, setTasks] = useState<number>(sprite?.tasks ?? 1)
  const [nameError, setNameError] = useState(false)

  const taskOptions = Array.from(
    { length: maxSpriteTasks },
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
      tasks: Math.min(tasks, maxSpriteTasks),
    })
  }

  const handleClosed = () => {
    setName(sprite?.name ?? "")
    setTasks(sprite?.tasks ?? 1)
    setNameError(false)
    onClosed?.()
  }

  return (
    <Dialog open={open} fullWidth onTransitionExited={handleClosed}>
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

          {maxSpriteTasks === 0
            ? (
                <Typography variant="caption" color="warning.main">
                  Add the Compiling skill to enable sprites with tasks
                </Typography>
              )
            : (
                <FormControl fullWidth size="small">
                  <InputLabel>Tasks</InputLabel>
                  <Select
                    value={Math.min(tasks, maxSpriteTasks)}
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
              )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
