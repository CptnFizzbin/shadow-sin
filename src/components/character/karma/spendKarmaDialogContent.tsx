import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"

import { AttributeTab } from "./characterImprovements/attributeTab.tsx"
import type { SpendType } from "./characterImprovements/forms/spendKarmaDialogContext.tsx"
import { SPEND_TYPE_LABELS, useSpendKarmaDialogContext } from "./characterImprovements/forms/spendKarmaDialogContext.tsx"
import { IncreaseSkillTab } from "./characterImprovements/increaseSkillTab.tsx"
import { NewSkillTab } from "./characterImprovements/newSkillTab.tsx"
import { NewSpellTab } from "./characterImprovements/newSpellTab.tsx"
import { SkillGroupTab } from "./characterImprovements/skillGroupTab.tsx"

export const SpendKarmaDialogContent: FC<ControlledDialogProps<void>> = ({ ctrl }) => {
  const {
    spendType,
    canLearnSpell,
    handleSpendTypeChange,
    karmaCost,
    canSave,
    currentKarma,
    handleSave,
    handleClosed,
  } = useSpendKarmaDialogContext()

  const spendTypes: SpendType[] = ["attribute", "skillGroup", "increaseSkill", "newSkill"]
  if (canLearnSpell) spendTypes.push("newSpell")

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" onClosed={handleClosed}>
      <Dialog.Title>Spend Karma</Dialog.Title>

      <Dialog.Content>
        <Stack>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">Unspent Karma</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>{currentKarma}</Typography>
          </Stack>

          <Tabs
            value={spendType}
            onChange={handleSpendTypeChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {spendTypes.map((type) => (
              <Tab key={type} value={type} label={SPEND_TYPE_LABELS[type]} />
            ))}
          </Tabs>

          {spendType === "attribute" && <AttributeTab />}
          {spendType === "skillGroup" && <SkillGroupTab />}
          {spendType === "increaseSkill" && <IncreaseSkillTab />}
          {spendType === "newSkill" && <NewSkillTab />}
          {spendType === "newSpell" && <NewSpellTab />}

          {karmaCost !== null && karmaCost > currentKarma && (
            <Alert severity="warning">
              Not enough karma. You need {karmaCost} but only have {currentKarma}.
            </Alert>
          )}
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={!canSave}
          onClick={handleSave}
        >
          {karmaCost !== null ? `Spend ${karmaCost} Karma` : "Spend Karma"}
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}
