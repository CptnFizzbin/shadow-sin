import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { RiArrowLeftLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"

import type { DefenseAttackType } from "./defenseCalculatorData.ts"
import { defenseAttackTypes } from "./defenseCalculatorData.ts"
import { DefenseCalculatorHubList } from "./defenseCalculatorHubList.tsx"
import { DefenseCalculatorPanel } from "./defenseCalculatorPanel.tsx"

export const DefenseCalculatorDialogContent: FC<ControlledDialogProps> = ({ ctrl }) => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))

  // null = the hub (attack type list); an attack type = that type is drilled into.
  const [activeAttackType, setActiveAttackType] = useState<DefenseAttackType | null>(null)
  const activeAttackTypeInfo = defenseAttackTypes.find((info) => info.type === activeAttackType) ?? null

  const goToHub = () => setActiveAttackType(null)

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" fullScreen={isNarrowViewport} onClosed={goToHub}>
      <Dialog.Title>
        {activeAttackTypeInfo
          ? (
              <Stack direction="row" sx={{ alignItems: "center" }}>
                <IconButton aria-label="Back to attack types" onClick={goToHub}>
                  <RiArrowLeftLine size={20} />
                </IconButton>
                <Box sx={{ flex: 1 }}>{activeAttackTypeInfo.label}</Box>
                {/* Spacer mirrors the back button so the title stays centered. */}
                <Box sx={{ width: 36 }} />
              </Stack>
            )
          : "Defense Calculator"}
      </Dialog.Title>

      <Dialog.Content dividers>
        <Box sx={{ minHeight: isNarrowViewport ? undefined : 420 }}>
          {activeAttackType === null
            ? <DefenseCalculatorHubList onSelectAttackType={setActiveAttackType} />
            : <DefenseCalculatorPanel key={activeAttackType} attackType={activeAttackType} />}
        </Box>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onClick={() => ctrl.close()}>Close</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}
