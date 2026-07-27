import Button from "@mui/material/Button"
import { RiShieldLine } from "@remixicon/react"
import type { FC } from "react"

import { useDialogCtrl } from "#/lib/hooks/ui/dialog/useDialogCtrl.ts"

import { DefenseCalculatorDialogContent } from "./defenseCalculatorDialogContent.tsx"

export const DefenseCalculatorButton: FC = () => {
  const ctrl = useDialogCtrl<void>()

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiShieldLine />}
        onClick={() => ctrl.open()}
      >
        Defense Calculator
      </Button>

      <DefenseCalculatorDialogContent ctrl={ctrl} />
    </>
  )
}
