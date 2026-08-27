import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiCheckLine, RiTerminalBoxLine } from "@remixicon/react"
import type { FC } from "react"

import { ImprovementQueuedLearnRow } from "#/components/improvements/improvementQueuedLearnRow.tsx"
import { ImprovementsConfig } from "#/components/improvements/improvementsConfig.ts"
import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"
import { KarmaValue } from "#/components/runner/karma/karmaValue.tsx"
import { useComplexFormDialog } from "#/components/runner/technomancer/dialogs/complexFormDialog.tsx"
import { useSpendKarmaDialogContext } from "#/contexts/improvements/spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "#/hooks/improvements/useImprovementSelector.ts"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { ComplexFormsSelectors } from "#/stores/runner/complexForms/complexFormsSlice.selectors.ts"
import { KarmaSelectors } from "#/stores/runner/karma/karmaSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type {
  ComplexFormIncreaseEntry,
  LearnComplexFormEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  isComplexFormIncreaseEntry,
  isLearnComplexFormEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import { getImprovementCost } from "#/system/karma/improvements/improvementUtils.ts"

export const ImprovementComplexFormList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const knownComplexForms = useRunnerSelector(ComplexFormsSelectors.selectAll)
  const resonance = useRunnerSelector(AttrSelectors.selectBase, { key: AttributeKey.resonance })
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)
  const complexFormDialog = useComplexFormDialog()

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedIncreases = allImprovements.filter(isComplexFormIncreaseEntry)
  const queuedLearns = allImprovements.filter(isLearnComplexFormEntry)
  const maxRating = Math.max(resonance, 1)

  const openLearnDialog = async () => {
    const saved = await complexFormDialog.open({ maxRating })
    if (!saved) return
    const newEntry: Omit<LearnComplexFormEntry, "id"> = {
      type: ImprovementType.learnComplexForm,
      complexForm: saved,
    }
    improvementStore.add(newEntry)
  }

  const hasContent = knownComplexForms.length > 0 || queuedLearns.length > 0

  return (
    <Stack sx={{ gap: 1.5 }}>
      {hasContent && (
        <Paper variant="outlined">
          <List disablePadding>
            {knownComplexForms.map((complexForm, index) => {
              const karmaCost = ImprovementsConfig.technomancer.complexForms.karamCost.increase(
                complexForm.rating + 1,
              )
              const isAtMax = complexForm.rating >= maxRating
              const queuedEntry = queuedIncreases.find(
                (entry) => entry.complexFormId === complexForm.id,
              ) ?? null
              const canAfford = queuedEntry !== null || karmaCost <= remainingKarma
              const isLast = index === knownComplexForms.length - 1 && queuedLearns.length === 0

              const handleToggle = () => {
                if (queuedEntry) {
                  improvementStore.remove(queuedEntry.id)
                  return
                }
                if (isAtMax) return
                const newEntry: Omit<ComplexFormIncreaseEntry, "id"> = {
                  type: ImprovementType.complexFormIncrease,
                  complexFormId: complexForm.id,
                  baseRating: complexForm.rating,
                  newRating: complexForm.rating + 1,
                }
                improvementStore.add(newEntry)
              }

              return (
                <ListItem
                  key={complexForm.id}
                  disablePadding
                  divider={!isLast}
                  secondaryAction={(
                    <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                      {isAtMax
                        ? <Chip label="Max" size="small" />
                        : (
                            <KarmaChip
                              amount={karmaCost}
                              size="small"
                              color={queuedEntry ? "success" : canAfford ? "default" : "warning"}
                            />
                          )}
                      {queuedEntry && (
                        <RiCheckLine size={14} style={{ color: "var(--mui-palette-success-main)" }} />
                      )}
                    </Stack>
                  )}
                >
                  <ListItemButton
                    disabled={(isAtMax && !queuedEntry) || (!canAfford && !queuedEntry)}
                    aria-pressed={queuedEntry !== null}
                    onClick={handleToggle}
                    sx={{
                      minHeight: 52,
                      opacity: !canAfford && !queuedEntry && !isAtMax ? 0.45 : 1,
                    }}
                  >
                    <ListItemText
                      primary={complexForm.name}
                      secondary={isAtMax
                        ? `Rating ${complexForm.rating}`
                        : `${complexForm.rating} → ${complexForm.rating + 1}`}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
            {queuedLearns.map((entry, index) => (
              <ImprovementQueuedLearnRow
                key={entry.id}
                primary={entry.complexForm.name}
                secondary={`New complex form · Rating ${entry.complexForm.rating}`}
                cost={getImprovementCost(entry)}
                isLastRow={index === queuedLearns.length - 1}
                onRemove={() => improvementStore.remove(entry.id)}
              />
            ))}
          </List>
        </Paper>
      )}

      {!hasContent && (
        <Stack sx={{ py: 2, alignItems: "center", gap: 0.5 }}>
          <RiTerminalBoxLine size={28} style={{ opacity: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            No complex forms known
          </Typography>
        </Stack>
      )}

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        endIcon={<KarmaValue amount={ImprovementsConfig.technomancer.complexForms.karamCost.learnNew} />}
        onClick={openLearnDialog}
        sx={{ alignSelf: "flex-start" }}
      >
        Learn New Complex Form
      </Button>

      {complexFormDialog.outlet}
    </Stack>
  )
}
