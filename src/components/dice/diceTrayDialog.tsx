import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { Dialog } from "#/components/ui/dialog/dialog.tsx"

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
      onClosed={() => diceTrayApi.reset()}
    >
      <Dialog.Title>Dice Tray</Dialog.Title>

      <Dialog.Content>
        <Stack sx={{ paddingTop: 1 }}>
          <DiceTrayHeader />
          <DiceTrayInputs />
          <DiceTrayDiceDisplay />
          <DiceTrayResultLabels />
          <DiceTrayExtendedHistory />
          <DiceTrayEdgeControls />
          <DiceTrayActions />
        </Stack>
      </Dialog.Content>

      <Divider />

      <Dialog.Actions>
        <Button onClick={() => diceTrayApi.close()} fullWidth>
          Close
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
