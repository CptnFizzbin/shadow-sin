import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Badge from "@mui/material/Badge"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiArrowDownSLine, RiFlashlightLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { useTemporaryEffectsStore } from "#/components/character/temporaryEffects/useTemporaryEffectsStore.ts"

import { ActiveEffectsList } from "./activeEffectsList.tsx"
import { AddTemporaryEffectDialog } from "./dialogs/addTemporaryEffectDialog.tsx"
import { selectAllGameEffects } from "./useGameEffects.ts"

export const TemporaryEffectsSection: FC = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const temporaryEffectsStore = useTemporaryEffectsStore()
  const activeEffects = useCharacterSheetSelector(selectAllGameEffects)
  const activeEffectCount = activeEffects.length

  return (
    <>
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<RiArrowDownSLine />}>
          <Stack direction="row" sx={{ alignItems: "center", gap: 1, flexGrow: 1 }}>
            <RiFlashlightLine size={16} />
            <Typography variant="subtitle2">Active Effects</Typography>
            {activeEffectCount > 0 && (
              <Badge badgeContent={activeEffectCount} color="primary" />
            )}
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack sx={{ gap: 1 }}>
            <ActiveEffectsList />
            <Button
              size="small"
              startIcon={<RiAddLine size={14} />}
              onClick={() => setAddDialogOpen(true)}
              sx={{ alignSelf: "flex-start" }}
            >
              Add Temporary Effect
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <AddTemporaryEffectDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={(effect) => temporaryEffectsStore.add(effect)}
      />
    </>
  )
}
