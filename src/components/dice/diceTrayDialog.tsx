import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { DiceTrayActions } from "./diceTrayActions.tsx"
import { useDiceTray } from "./diceTrayContext.ts"
import { DiceTrayDiceDisplay } from "./diceTrayDiceDisplay.tsx"
import { DiceTrayEdgeControls } from "./diceTrayEdgeControls.tsx"
import { DiceTrayExtendedHistory } from "./diceTrayExtendedHistory.tsx"
import { DiceTrayHeader } from "./diceTrayHeader.tsx"
import { DiceTrayInputs } from "./diceTrayInputs.tsx"
import { DiceTrayResultLabels } from "./diceTrayResultLabels.tsx"

export const DiceTrayDialog: FC = () => {
  const diceTrayApi = useDiceTray()
  const open = useSelector(diceTrayApi.store, (state) => state.open)

  return (
    <Dialog
      open={open}
      onClose={() => diceTrayApi.close()}
      slotProps={{
        transition: {
          onExited: () => diceTrayApi.reset(),
        },
      }}
      fullWidth
    >
      <DialogTitle>Dice Tray</DialogTitle>

      <DialogContent>
        <Stack sx={{ paddingTop: 1 }}>
          <DiceTrayHeader />
          <DiceTrayInputs />
          <DiceTrayDiceDisplay />
          <DiceTrayResultLabels />
          <DiceTrayExtendedHistory />
          <DiceTrayEdgeControls />
          <DiceTrayActions />
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={() => diceTrayApi.close()} fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
