import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"

interface ViewSkillDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  name: string
  body?: ReactNode
  dicePools?: (false | DicePoolData)[]
}

const ViewSkillDialog: FC<ViewSkillDialogProps> = ({
  open,
  onClose,
  onClosed,
  name,
  dicePools = [],
  body,
}) => {
  return (
    <Dialog open={open} onClose={onClose} onClosed={onClosed}>
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
    </Dialog>
  )
}

type UseViewSkillDialogProps = Omit<ViewSkillDialogProps, "open" | "onClose" | "onClosed">

export const useViewSkillDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseViewSkillDialogProps) => dialogApi.open<void>(
      (ctrl, open) => (
        <ViewSkillDialog
          {...props}
          open={open}
          onClose={() => ctrl.close()}
          onClosed={() => ctrl.onClosed()}
        />
      ),
    ),
  }
}
