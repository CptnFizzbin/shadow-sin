import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import type { FC, SyntheticEvent } from "react"
import { useState } from "react"

import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { isMagician } from "#/components/character/spells/spellsUtils.ts"
import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"

import { AttributeTab } from "./characterImprovements/attributeTab.tsx"
import { useSpendKarmaDialogContext } from "./characterImprovements/forms/spendKarmaDialogContext.tsx"
import { selectQueuedImprovements } from "./characterImprovements/improvements.selectors.ts"
import { calcImprovementsKarmaCost } from "./characterImprovements/improvementsKarmaCost.ts"
import { applyImprovementsAndSpendKarma } from "./characterImprovements/improvementsUtils.ts"
import { IncreaseSkillTab } from "./characterImprovements/increaseSkillTab.tsx"
import { NewSkillTab } from "./characterImprovements/newSkillTab.tsx"
import { NewSpellTab } from "./characterImprovements/newSpellTab.tsx"
import { PendingImprovementsList } from "./characterImprovements/pendingImprovementsList.tsx"
import { SkillGroupTab } from "./characterImprovements/skillGroupTab.tsx"
import { selectCurrentKarma } from "./karmaSelectors.ts"
import { useKarmaStore } from "./useKarmaStore.ts"

type SpendType = "attribute" | "skillGroup" | "increaseSkill" | "newSkill" | "newSpell"

const SPEND_TYPE_LABELS: Record<SpendType, string> = {
  attribute: "Attribute",
  skillGroup: "Skill Group",
  increaseSkill: "Increase Skill",
  newSkill: "New Skill",
  newSpell: "New Spell",
}

export const SpendKarmaDialogContent: FC<ControlledDialogProps<void>> = ({ ctrl }) => {
  const { improvementsStore } = useSpendKarmaDialogContext()
  const characterSheetStore = useCharacterSheetContext()
  const karmaStore = useKarmaStore()

  const currentKarma = useSelector(karmaStore, selectCurrentKarma)
  const awakeningType = useCharacterSheetSelector((sheet) => sheet.biology.awakening)
  const canLearnSpell = isMagician(awakeningType)

  const improvements = useSelector(improvementsStore.store, selectQueuedImprovements)
  const karmaCost = calcImprovementsKarmaCost(improvements)
  const canSave = improvements.length > 0 && karmaCost <= currentKarma

  const [spendType, setSpendType] = useState<SpendType>("attribute")

  const handleSpendTypeChange = (_event: SyntheticEvent, newValue: SpendType) => {
    setSpendType(newValue)
  }

  const handleSave = () => {
    if (!canSave) return
    applyImprovementsAndSpendKarma(improvementsStore, characterSheetStore, karmaStore)
    ctrl.close()
  }

  const handleClosed = () => {
    improvementsStore.clear()
    setSpendType("attribute")
  }

  const availableSpendTypes: SpendType[] = ["attribute", "skillGroup", "increaseSkill", "newSkill"]
  if (canLearnSpell) availableSpendTypes.push("newSpell")

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" onClosed={handleClosed}>
      <Dialog.Title>Spend Karma</Dialog.Title>

      <Dialog.Content>
        <Stack>
          <PendingImprovementsList
            improvements={improvements}
            improvementsStore={improvementsStore}
          />

          <Tabs
            value={spendType}
            onChange={handleSpendTypeChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {availableSpendTypes.map((type) => (
              <Tab key={type} value={type} label={SPEND_TYPE_LABELS[type]} />
            ))}
          </Tabs>

          {spendType === "attribute" && <AttributeTab />}
          {spendType === "skillGroup" && <SkillGroupTab />}
          {spendType === "increaseSkill" && <IncreaseSkillTab />}
          {spendType === "newSkill" && <NewSkillTab />}
          {spendType === "newSpell" && <NewSpellTab />}

          {karmaCost > currentKarma && (
            <Alert severity="warning">
              Not enough karma. You need {karmaCost} but only have {currentKarma}.
            </Alert>
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
