import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"

interface ViewSkillDialogProps extends ControlledDialogProps<void> {
  name: string
  body?: ReactNode
  dicePools?: (false | DicePoolData)[]
}

/** Renders dice pools side by side, stacking into a column on narrow (mobile) viewports. */
export const DicePoolsStack: FC<{ dicePools: (false | DicePoolData)[] }> = ({ dicePools }) => (
  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
    {dicePools
      .filter((item): item is DicePoolData => Boolean(item))
      .map((pool) => (
        <DicePool
          key={pool.name}
          {...pool}
        />
      ))}
  </Stack>
)

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

          <DicePoolsStack dicePools={dicePools} />
        </Stack>
      </Dialog.Content>
    </ControlledDialog>
  )
}

type UseViewSkillDialogProps = Omit<ViewSkillDialogProps, keyof ControlledDialogProps<void>>

export const useViewSkillDialog = () => useDialog<void, UseViewSkillDialogProps>(
  (ctrl, props) => <ViewSkillDialog ctrl={ctrl} {...props} />,
)
