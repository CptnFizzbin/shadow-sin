import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"

interface ViewSkillDialogProps extends ControlledDialogProps<void> {
  name: string
  body?: ReactNode
  dicePools?: (false | DicePoolData)[]
}

const ViewSkillDialog: FC<ViewSkillDialogProps> = ({
  ctrl,
  name,
  dicePools = [],
  body,
}) => {
  return (
    <ControlledDialog ctrl={ctrl}>
      <Dialog.Title>{name}</Dialog.Title>
      <Dialog.Content>
        <Stack spacing={1}>
          {body}

          <Stack direction="row">
            {dicePools
              .filter((item): item is DicePoolData => Boolean(item))
              .map((pool) => (
                <DicePool
                  key={pool.name}
                  {...pool}
                />
              ))}
          </Stack>
        </Stack>
      </Dialog.Content>
    </ControlledDialog>
  )
}

type UseViewSkillDialogProps = Omit<ViewSkillDialogProps, keyof ControlledDialogProps<void>>

export const useViewSkillDialog = () => useDialog<void, UseViewSkillDialogProps>(
  (ctrl, props) => <ViewSkillDialog ctrl={ctrl} {...props} />,
)
