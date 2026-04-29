import type { DialogProps } from "@mui/material/Dialog"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"

interface ViewSkillDialogProps extends DialogProps {
  name: string
  body?: ReactNode
  dicePools?: (false | DicePoolData)[]
}

const ViewSkillDialog: FC<ViewSkillDialogProps> = ({
  name,
  dicePools = [],
  body,
  ...props
}) => {
  return (
    <Dialog {...props}>
      <DialogTitle sx={{ padding: 1 }}>{name}</DialogTitle>
      <DialogContent sx={{ padding: 1 }}>
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
      </DialogContent>
    </Dialog>
  )
}

export type UseViewSkillDialogProps = Omit<ViewSkillDialogProps, "open" | "onClose">

export const useViewSkillDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseViewSkillDialogProps) => dialogApi.open<void>(
      (dialogProps) => (
        <ViewSkillDialog
          {...props}
          open={dialogProps.open}
          onClose={() => dialogProps.onClose()}
          slotProps={{ transition: { onExited: dialogProps.onClosed } }}
        />
      ),
    ),
  }
}
