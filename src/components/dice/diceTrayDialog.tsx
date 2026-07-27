import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"
import { useDiceTray } from "#/lib/contexts/dice/diceTrayContext.ts"

import { DiceTrayActions } from "./diceTrayActions.tsx"
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
