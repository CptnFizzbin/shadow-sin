import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import type { FC } from "react"
import { useState } from "react"

import { GameEffectRow } from "#/components/system/gameEffects/gameEffectRow.tsx"
import { getDefaultTarget } from "#/components/system/gameEffects/gameEffectUtils.ts"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { GameEffectData, TemporaryEffectData } from "#/system/gameEffects/gameEffectData.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

interface AddTemporaryEffectDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (effect: TemporaryEffectData) => void
}

const defaultEffect = (): GameEffectData => ({
  type: GameEffectType.attrMod,
  target: getDefaultTarget(GameEffectType.attrMod) ?? AttributeKey.body,
  value: 0,
})

export const AddTemporaryEffectDialog: FC<AddTemporaryEffectDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [label, setLabel] = useState("")
  const [effect, setEffect] = useState<GameEffectData>(defaultEffect)

  const handleClose = () => {
    setLabel("")
    setEffect(defaultEffect())
    onClose()
  }

  const handleAdd = () => {
    if (!label.trim()) return
    onAdd({
      ...effect,
      id: crypto.randomUUID(),
      label: label.trim(),
      enabled: true,
    })
    setLabel("")
    setEffect(defaultEffect())
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <Dialog.Title>Add Temporary Effect</Dialog.Title>
      <Dialog.Content>
        <Stack sx={{ gap: 2 }}>
          <TextField
            label="Label"
            placeholder="e.g. Team Coordination, Smartlink Active"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            size="small"
            fullWidth
            required
            autoFocus
          />
          <GameEffectRow
            effect={effect}
            onChange={setEffect}
            onRemove={() => setEffect(defaultEffect())}
          />
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={!label.trim()}>
          Add
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
