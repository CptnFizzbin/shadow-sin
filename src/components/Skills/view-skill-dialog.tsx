import type { DialogProps } from "@mui/material/Dialog"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

import type { DicePoolData } from "#/components/DicePool/dice-pool-data.tsx"
import { DicePool } from "#/components/DicePool/dice-pool.tsx"

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
      <DialogTitle>{name}</DialogTitle>
      <DialogContent>
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
