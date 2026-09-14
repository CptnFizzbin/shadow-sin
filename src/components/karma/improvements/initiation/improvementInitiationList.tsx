import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { RiCheckLine } from "@remixicon/react"
import type { FC } from "react"

import { ImprovementsConfig } from "#/components/karma/improvements/improvementsConfig.ts"
import { KarmaChip } from "#/components/karma/viewer/karmaChip.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import { useSpendKarmaDialogContext } from "#/components/karma/spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "#/hooks/improvements/useImprovementSelector.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/services/improvements/improvementSelectors.ts"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import type { InitiationIncreaseEntry } from "#/system/model/karma/improvements/improvementEntry.ts"
import { isInitiationIncreaseEntry } from "#/system/model/karma/improvements/improvementEntry.ts"
import { ImprovementType } from "#/system/model/karma/improvements/improvementType.ts"

export const ImprovementInitiationList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const currentGrade = useRunnerSelector(ViewerStateSelectors.selectRunner).initiateGrade
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)

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
