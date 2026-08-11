import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { RiCheckLine } from "@remixicon/react"
import type { FC } from "react"

import { ImprovementsConfig } from "#/components/improvements/improvementsConfig.ts"
import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import { useSpendKarmaDialogContext } from "#/lib/contexts/improvements/spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "#/lib/hooks/improvements/useImprovementSelector.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerSelector.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { SubmersionIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import { isSubmersionIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"

export const ImprovementSubmersionList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const currentGrade = useRunnerSelector(({ magicAdvancement }) => magicAdvancement.submersionGrade)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerStoreSelector(Selectors.karma.selectCurrentKarma)

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedEntry = allImprovements.filter(isSubmersionIncreaseEntry)[0] ?? null
  const nextGrade = currentGrade + 1
  const cost = ImprovementsConfig.technomancer.submersion.karamCost.improve(nextGrade)
  const canAfford = queuedEntry !== null || cost <= remainingKarma

  const handleToggle = () => {
    if (queuedEntry) {
      improvementStore.remove(queuedEntry.id)
      return
    }
    const newEntry: Omit<SubmersionIncreaseEntry, "id"> = {
      type: ImprovementType.submersionIncrease,
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
              <ListItemText primary="Submersion Grade" secondary={`${currentGrade} → ${nextGrade}`} />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>

      <UnderConstruction
        title="Echoes coming soon"
        description="Picking an Echo when you submerge isn't supported yet — for now this just raises your Submersion Grade."
      />
    </Stack>
  )
}
