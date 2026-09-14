import Button from "@mui/material/Button"
import { RiSwordLine } from "@remixicon/react"
import type { FC } from "react"

import { useDialogCtrl } from "#/hooks/ui/dialog/useDialogCtrl.ts"

import { CombatActionsCheatSheetDialogContent } from "./combatActionsCheatSheetDialogContent.tsx"

export const CombatActionsCheatSheetButton: FC = () => {
  const ctrl = useDialogCtrl<void>()

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiSwordLine />}
        onClick={() => ctrl.open()}
      >
        Combat Actions Cheat Sheet
      </Button>

      <CombatActionsCheatSheetDialogContent ctrl={ctrl} />
    </>
  )
}
