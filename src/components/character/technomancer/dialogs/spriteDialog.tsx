import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useMaxSpriteTasks } from "#/components/character/technomancer/spritesHooks.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"

interface SpriteDialogProps {
  open: boolean
  sprite?: SpriteData
  onSave: (sprite: SpriteData) => void
  onClose: () => void
  onClosed?: () => void
}

const SpriteDialog: FC<SpriteDialogProps> = ({
  open,
  sprite,
  onSave,
  onClose,
  onClosed,
}) => {
  const maxSpriteTasks = useMaxSpriteTasks()
  const isEditMode = !!sprite

  const [name, setName] = useState<string>(sprite?.name ?? "")
  const [tasks, setTasks] = useState<number>(sprite?.services.max ?? 1)
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
      id: sprite?.id ?? NullUuid,
      name: name.trim(),
      force: sprite?.force ?? 0,
      services: {
        max: Math.min(tasks, maxSpriteTasks),
        used: sprite?.services.used ?? 0,
      },
    })
  }

  const handleClosed = () => {
    setName(sprite?.name ?? "")
    setTasks(sprite?.services.max ?? 1)
    setNameError(false)
    onClosed?.()
  }

  return (
    <Dialog open={open} onClosed={handleClosed}>
      <Dialog.Title>{isEditMode ? "Edit Sprite" : "Add Sprite"}</Dialog.Title>

      <Dialog.Content>
        <Stack sx={{ gap: 2, pt: 1 }}>
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
                <Typography color="warning.main">
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
      </Dialog.Content>

      <Dialog.Actions>
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSave}>
          Save
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export interface UseSpriteDialogProps {
  sprite?: SpriteData
}

export const useSpriteDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseSpriteDialogProps) => dialogApi.open<SpriteData>(
      (ctrl, open) => (
        <SpriteDialog
          open={open}
          sprite={props?.sprite}
          onSave={(sprite) => ctrl.close(sprite)}
          onClose={() => ctrl.close()}
          onClosed={() => ctrl.onClosed()}
        />
      ),
    ),
  }
}
