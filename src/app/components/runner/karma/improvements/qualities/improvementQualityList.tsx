import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiCheckLine } from "@remixicon/react"
import type { FC } from "react"

import { ImprovementQueuedLearnRow } from "#/components/runner/karma/improvements/improvementQueuedLearnRow.tsx"
import { ImprovementsConfig } from "#/components/runner/karma/improvements/improvementsConfig.ts"
import { useSpendKarmaDialogContext } from "#/components/runner/karma/spendKarmaDialogContext.tsx"
import { KarmaChip } from "#/components/runner/karma/viewer/karmaChip.tsx"
import { useQualityFormDialog } from "#/components/runner/sections/qualities/viewer/dialogs/qualityFormDialog.tsx"
import { useImprovementSelector } from "#/hooks/improvements/useImprovementSelector.ts"
import { selectAllImprovements, selectImprovementsTotalCost } from "#/services/improvements/improvementSelectors.ts"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { QualitiesSelectors } from "#/state/runner/qualities/qualities.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { getImprovementCost } from "#/system/formulas/karma/improvements/improvementUtils.ts"
import type { LearnQualityEntry, QualityBuyOffEntry } from "#/system/model/karma/improvements/improvementEntry.ts"
import { isLearnQualityEntry, isQualityBuyOffEntry } from "#/system/model/karma/improvements/improvementEntry.ts"
import { ImprovementType } from "#/system/model/karma/improvements/improvementType.ts"

export const ImprovementQualityList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const qualities = useRunnerSelector(QualitiesSelectors.selectAll)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)
  const qualityFormDialog = useQualityFormDialog()

  const remainingKarma = currentKarma - totalQueuedCost
  const negativeQualities = qualities.filter((quality) => quality.type === "negative")
  const queuedBuyOffs = allImprovements.filter(isQualityBuyOffEntry)
  const queuedLearns = allImprovements.filter(isLearnQualityEntry)

  const openNewQualityDialog = async () => {
    const saved = await qualityFormDialog.open()
    if (!saved) return
    const newEntry: Omit<LearnQualityEntry, "id"> = {
      type: ImprovementType.learnQuality,
      quality: saved,
    }
    improvementStore.add(newEntry)
  }

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Alert severity="warning">
        New qualities and negative-quality buy-offs must be approved by your GM before the karma
        spend is final.
      </Alert>

      <Typography variant="overline" color="text.secondary">Buy Off Negative Qualities</Typography>

      {negativeQualities.length === 0
        ? (
            <Typography variant="body2" color="text.secondary">
              No negative qualities to buy off.
            </Typography>
          )
        : (
            <Paper variant="outlined">
              <List disablePadding>
                {negativeQualities.map((quality, index) => {
                  const cost = ImprovementsConfig.qualities.negative.karamaCost.removeQuality(quality)
                  const queuedEntry = queuedBuyOffs.find(
                    (entry) => entry.qualityId === quality.id,
                  ) ?? null
                  const canAfford = queuedEntry !== null || cost <= remainingKarma

                  const handleToggle = () => {
                    if (queuedEntry) {
                      improvementStore.remove(queuedEntry.id)
                      return
                    }
                    const newEntry: Omit<QualityBuyOffEntry, "id"> = {
                      type: ImprovementType.qualityBuyOff,
                      qualityId: quality.id,
                      qualityName: quality.name,
                      bpValue: quality.bpValue ?? 0,
                    }
                    improvementStore.add(newEntry)
                  }

                  return (
                    <ListItem
                      key={quality.id}
                      disablePadding
                      divider={index < negativeQualities.length - 1}
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
                        <ListItemText primary={quality.name} secondary="Buy off" />
                      </ListItemButton>
                    </ListItem>
                  )
                })}
              </List>
            </Paper>
          )}

      <Typography variant="overline" color="text.secondary">New Positive Quality</Typography>

      {queuedLearns.length > 0 && (
        <Paper variant="outlined">
          <List disablePadding>
            {queuedLearns.map((entry, index) => (
              <ImprovementQueuedLearnRow
                key={entry.id}
                primary={entry.quality.name}
                secondary="New quality"
                cost={getImprovementCost(entry)}
                isLastRow={index === queuedLearns.length - 1}
                onRemove={() => improvementStore.remove(entry.id)}
              />
            ))}
          </List>
        </Paper>
      )}

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={openNewQualityDialog}
        sx={{ alignSelf: "flex-start" }}
      >
        Add Quality
      </Button>

      {qualityFormDialog.outlet}
    </Stack>
  )
}
