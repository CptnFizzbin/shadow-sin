import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import * as React from "react"

import { GameEffectRow } from "#/components/system/gameEffects/gameEffectRow.tsx"
import { getDefaultTarget } from "#/components/system/gameEffects/gameEffectUtils.ts"
import type { DialogApiDialogProps } from "#/components/ui/dialogs/dialogApi.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

export type GameEffectsDialogProps = DialogApiDialogProps<GameEffectData[]> & {
  initialEffects: GameEffectData[]
}

export const GameEffectsDialog: FC<GameEffectsDialogProps> = ({
  open,
  onClose,
  onClosed,
  initialEffects,
}) => {
  const [effects, setEffects] = React.useState<GameEffectData[]>(initialEffects)

  const handleAdd = () => {
    const defaultTarget = getDefaultTarget(GameEffectType.attrMod) ?? AttributeKey.body
    setEffects([
      ...effects,
      {
        type: GameEffectType.attrMod,
        target: defaultTarget,
        value: 0,
      },
    ])
  }

  const handleChange = (index: number, updated: GameEffectData) => {
    const newEffects = [...effects]
    newEffects[index] = updated
    setEffects(newEffects)
  }

  const handleRemove = (index: number) => {
    setEffects(effects.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onTransitionExited={onClosed} fullWidth maxWidth="sm">
      <DialogTitle>Effects</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2, pt: 1 }}>
          {effects.length === 0 && (
            <Typography color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
              No effects added yet.
            </Typography>
          )}

          {effects.map((effect, index) => (
            <React.Fragment key={`${effect.type}-${effect.target ?? "none"}-${index}`}>
              {index > 0 && <Divider />}
              <GameEffectRow
                effect={effect}
                onChange={(updated) => handleChange(index, updated)}
                onRemove={() => handleRemove(index)}
              />
            </React.Fragment>
          ))}

          <Button
            size="small"
            startIcon={<RiAddLine size={14} />}
            onClick={handleAdd}
            sx={{ alignSelf: "flex-start" }}
          >
            Add Effect
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onClose(effects)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
