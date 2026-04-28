import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { DiceTrayActions } from "#/components/dice/diceTrayActions.tsx"
import type { DiceTrayApi } from "#/components/dice/diceTrayApi.ts"
import { DiceTrayDiceDisplay } from "#/components/dice/diceTrayDiceDisplay.tsx"
import { DiceTrayEdgeControls } from "#/components/dice/diceTrayEdgeControls.tsx"
import { DiceTrayExtendedHistory } from "#/components/dice/diceTrayExtendedHistory.tsx"
import { DiceTrayHeader } from "#/components/dice/diceTrayHeader.tsx"
import { DiceTrayInputs } from "#/components/dice/diceTrayInputs.tsx"
import { DiceTrayResultLabels } from "#/components/dice/diceTrayResultLabels.tsx"

interface DiceTrayDialogProps {
  diceTrayApi: DiceTrayApi
}

export const DiceTrayDialog: FC<DiceTrayDialogProps> = ({ diceTrayApi }) => {
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
          <DiceTrayHeader diceTrayApi={diceTrayApi} />
          <DiceTrayInputs diceTrayApi={diceTrayApi} />
          <DiceTrayDiceDisplay diceTrayApi={diceTrayApi} />
          <DiceTrayResultLabels diceTrayApi={diceTrayApi} />
          <DiceTrayExtendedHistory diceTrayApi={diceTrayApi} />
          <DiceTrayEdgeControls diceTrayApi={diceTrayApi} />
          <DiceTrayActions diceTrayApi={diceTrayApi} />
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
