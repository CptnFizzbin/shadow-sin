import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useMaxSpriteTasks } from "#/lib/hooks/runner/technomancer/spritesHooks.ts"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"

interface SpriteDialogProps extends ControlledDialogProps<SpriteData> {
  sprite?: SpriteData
}

const SpriteDialog: FC<SpriteDialogProps> = ({
  ctrl,
  sprite,
}) => {
  const maxSpriteTasks = useMaxSpriteTasks()
  const isEditMode = !!sprite

  const [name, setName] = useState<string>(sprite?.name ?? "")
  const [tasks, setTasks] = useState<number>(sprite?.services.max ?? 1)
  const [nameError, setNameError] = useState(false)

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(true)
      return
    }
    ctrl.close({
      id: sprite?.id ?? NullUuid,
      name: name.trim(),
      force: sprite?.force ?? 0,
      services: {
        max: Math.min(tasks, maxSpriteTasks),
        used: sprite?.services.used ?? 0,
      },
      damage: sprite?.damage ?? { matrix: 0 },
    })
  }

  const handleClosed = () => {
    setName(sprite?.name ?? "")
    setTasks(sprite?.services.max ?? 1)
    setNameError(false)
  }

  return (
    <ControlledDialog ctrl={ctrl} onClose={false} onClosed={handleClosed}>
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
                <CounterInput
                  label="Tasks"
                  size="small"
                  fullWidth
                  min={1}
                  max={maxSpriteTasks}
                  value={Math.min(tasks, maxSpriteTasks)}
                  onChange={(newValue) => setTasks(newValue ?? 1)}
                />
              )}
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSave}>
          Save
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

interface UseSpriteDialogProps {
  sprite?: SpriteData
}

export const useSpriteDialog = () => useDialog<SpriteData, UseSpriteDialogProps | undefined>(
  (ctrl, props) => <SpriteDialog ctrl={ctrl} sprite={props?.sprite} />,
)
