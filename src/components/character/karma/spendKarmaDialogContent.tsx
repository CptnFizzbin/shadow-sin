import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { selectHasImprovements, selectImprovementsTotalCost } from "#/system/karma/improvements/improvementSelectors.ts"
import { applyImprovements } from "#/system/karma/improvements/improvementUtils.ts"

import { ImprovementActiveSkillList } from "./characterImprovements/improvementActiveSkillList.tsx"
import { ImprovementAttributeList } from "./characterImprovements/improvementAttributeList.tsx"
import type { ImprovementCategory } from "./characterImprovements/improvementCategoryPicker.tsx"
import { ImprovementCategoryPicker } from "./characterImprovements/improvementCategoryPicker.tsx"
import { ImprovementQueueAccordion } from "./characterImprovements/improvementQueueAccordion.tsx"
import { ImprovementSkillGroupList } from "./characterImprovements/improvementSkillGroupList.tsx"
import { useSpendKarmaDialogContext } from "./characterImprovements/spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./characterImprovements/useImprovementSelector.ts"
import { selectCurrentKarma } from "./karmaSelectors.ts"
import { useKarmaStore } from "./useKarmaStore.ts"

export const SpendKarmaDialogContent: FC<ControlledDialogProps> = ({ ctrl }) => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const characterSheetStore = useCharacterSheetContext()
  const karmaStore = useKarmaStore()
  const [selectedCategory, setSelectedCategory] = useState<ImprovementCategory | null>(null)

  const currentKarma = useSelector(karmaStore, selectCurrentKarma)
  const karmaCost = useImprovementSelector(selectImprovementsTotalCost)
  const hasImprovements = useImprovementSelector(selectHasImprovements)
  const canSave = hasImprovements && karmaCost <= currentKarma

  const handleSave = () => {
    if (!canSave) return
    applyImprovements(improvementStore, characterSheetStore)
    ctrl.close()
  }

  const handleClosed = () => {
    improvementStore.removeAll()
    setSelectedCategory(null)
  }

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" onClosed={handleClosed}>
      <Dialog.Title>Spend Karma</Dialog.Title>

      <Dialog.Content dividers>
        <Stack sx={{ gap: 2 }}>
          <ImprovementQueueAccordion />

          <Divider />

          {selectedCategory === null && (
            <ImprovementCategoryPicker onSelectCategory={setSelectedCategory} />
          )}
          {selectedCategory === "attribute" && (
            <ImprovementAttributeList onBack={() => setSelectedCategory(null)} />
          )}
          {selectedCategory === "skill" && (
            <ImprovementActiveSkillList onBack={() => setSelectedCategory(null)} />
          )}
          {selectedCategory === "skillGroup" && (
            <ImprovementSkillGroupList onBack={() => setSelectedCategory(null)} />
          )}
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Stack direction="row" sx={{ justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <Stack direction="row" sx={{ gap: 2 }}>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="caption" color="text.secondary">Remaining</Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold" }}
                color={currentKarma - karmaCost < 0 ? "error" : "text.primary"}
              >
                {currentKarma - karmaCost}
              </Typography>
            </Stack>
            <Divider orientation="vertical" flexItem />
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="caption" color="text.secondary">Total Cost</Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>{karmaCost}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Button color="secondary" onClick={() => ctrl.close()}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={!canSave}
              onClick={handleSave}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Dialog.Actions>
    </ControlledDialog>
  )
}
