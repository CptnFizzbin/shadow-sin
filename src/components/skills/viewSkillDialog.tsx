import type { DialogProps } from "@mui/material/Dialog"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

import { DicePool } from "#/components/dicePool/dicePool.tsx"
import type { DicePoolData } from "#/components/dicePool/dicePoolData.tsx"

interface ViewSkillDialogProps extends DialogProps {
  name: string
  body?: ReactNode
  dicePools?: (false | DicePoolData)[]
}

export const ViewSkillDialog: FC<ViewSkillDialogProps> = ({
  name,
  dicePools = [],
  body,
  ...props
}) => {
  return (
    <Dialog {...props}>
      <DialogTitle sx={{ padding: 1 }}>{name}</DialogTitle>
      <DialogContent sx={{ padding: 1 }}>
        <Stack direction="row">
          {body}

          {dicePools
            .filter((item): item is DicePoolData => Boolean(item))
            .map((pool) => (
              <DicePool
                key={pool.name}
                {...pool}
              />
            ))}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
