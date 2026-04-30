import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { Fragment, useState } from "react"

import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

import { GameEffectRow } from "./gameEffectRow.tsx"
import { getDefaultTarget } from "./gameEffectUtils.ts"

interface GameEffectsDialogProps extends ControlledDialogProps<GameEffectData[]> {
  initialEffects: GameEffectData[]
}

const GameEffectsDialog: FC<GameEffectsDialogProps> = ({
  ctrl,
  initialEffects,
}) => {
  const [effects, setEffects] = useState<GameEffectData[]>(initialEffects)

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
    <ControlledDialog ctrl={ctrl} onClose={false} maxWidth="sm">
      <Dialog.Title>Effects</Dialog.Title>
      <Dialog.Content>
        {effects.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
            No effects added yet.
          </Typography>
        )}

        {effects.map((effect, index) => (
          <Fragment key={index}>
            {index > 0 && <Divider />}
            <GameEffectRow
              effect={effect}
              onChange={(updated) => handleChange(index, updated)}
              onRemove={() => handleRemove(index)}
            />
          </Fragment>
        ))}

        <Button
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={handleAdd}
          sx={{ alignSelf: "flex-start" }}
        >
          Add Effect
        </Button>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onClick={() => ctrl.close()}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => ctrl.close(effects)}
        >
          Save
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

type UseGameEffectsDialogProps = Omit<GameEffectsDialogProps, keyof ControlledDialogProps<GameEffectData[]>>

export const useGameEffectsDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseGameEffectsDialogProps) => dialogApi.open<GameEffectData[]>(
      (ctrl) => <GameEffectsDialog ctrl={ctrl} {...props} />,
    ),
  }
}
