import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { RiCheckLine } from "@remixicon/react"
import type { FC } from "react"

import { ImprovementsConfig } from "#/components/improvements/improvementsConfig.ts"
import { useImprovementSelector } from "#/components/improvements/useImprovementSelector.ts"
import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import { useSpendKarmaDialogContext } from "#/lib/contexts/improvements/spendKarmaDialogContext.tsx"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { InitiationIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import { isInitiationIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"

export const ImprovementInitiationList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const currentGrade = useRunnerStoreSelector((sheet) => sheet.initiateGrade)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerStoreSelector(Selectors.karma.selectCurrentKarma)

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedEntry = allImprovements.filter(isInitiationIncreaseEntry)[0] ?? null
  const nextGrade = currentGrade + 1
  const cost = ImprovementsConfig.magic.initiaition.karamaCost.improve(nextGrade)
  const canAfford = queuedEntry !== null || cost <= remainingKarma

  const handleToggle = () => {
    if (queuedEntry) {
      improvementStore.remove(queuedEntry.id)
      return
    }
    const newEntry: Omit<InitiationIncreaseEntry, "id"> = {
      type: ImprovementType.initiationIncrease,
      baseGrade: currentGrade,
      newGrade: nextGrade,
    }
    improvementStore.add(newEntry)
  }

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Paper variant="outlined">
        <List disablePadding>
          <ListItem
            disablePadding
            secondaryAction={(
              <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                <KarmaChip
                  amount={cost}
                  size="small"
                  color={queuedEntry ? "success" : canAfford ? "default" : "warning"}
                />
                {queuedEntry && (
                  <RiCheckLine size={14} style={{ color: "var(--mui-palette-success-main)" }} />
                )}
              </Stack>
            )}
          >
            <ListItemButton
              disabled={!canAfford && !queuedEntry}
              aria-pressed={queuedEntry !== null}
              onClick={handleToggle}
              sx={{
                minHeight: 52,
                opacity: !canAfford && !queuedEntry ? 0.45 : 1,
              }}
            >
              <ListItemText primary="Initiate Grade" secondary={`${currentGrade} → ${nextGrade}`} />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>

      <UnderConstruction
        title="Metamagics coming soon"
        description="Picking a metamagic when you initiate isn't supported yet — for now this just raises your Initiate Grade."
      />
    </Stack>
  )
}
