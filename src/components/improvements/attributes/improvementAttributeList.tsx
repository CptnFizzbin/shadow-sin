import Chip from "@mui/material/Chip"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { RiCheckLine } from "@remixicon/react"
import type { FC } from "react"

import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"
import { useSpendKarmaDialogContext } from "#/contexts/improvements/spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "#/hooks/improvements/useImprovementSelector.ts"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { KarmaSelectors } from "#/stores/runner/karma/karmaSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"
import { getAttributeCap } from "#/system/karma/improvements/improvementCaps.ts"
import type { AttrIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import { isAttrIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"

export const ImprovementAttributeList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const sheet = useRunnerSelector(ViewerStateSelectors.selectRunner)
  const activeAttributes = useRunnerSelector(AttrSelectors.selectActive)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedAttrIncreases = allImprovements.filter(isAttrIncreaseEntry)

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Paper variant="outlined">
        <List disablePadding>
          {activeAttributes.map((attrInfo, index) => {
            const karmaCost = (attrInfo.value + 1) * 5
            const queuedEntry = queuedAttrIncreases.find(
              (entry) => entry.attr === attrInfo.attr,
            ) ?? null
            // Use the karma-aware cap helper so Exceptional Attribute raises the ceiling.
            const cap = getAttributeCap(sheet, attrInfo.attr)
            const isAtMax = attrInfo.value >= cap
            const canAfford = queuedEntry !== null || karmaCost <= remainingKarma

            const handleToggle = () => {
              if (queuedEntry) {
                improvementStore.remove(queuedEntry.id)
              } else if (!isAtMax) {
                const newEntry: Omit<AttrIncreaseEntry, "id"> = {
                  type: ImprovementType.attrIncrease,
                  attr: attrInfo.attr,
                  baseRating: attrInfo.value,
                  newRating: attrInfo.value + 1,
                }
                improvementStore.add(newEntry)
              }
            }

            return (
              <ListItem
                key={attrInfo.attr}
                disablePadding
                divider={index < activeAttributes.length - 1}
                secondaryAction={(
                  <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                    {isAtMax && <Chip label="Max" size="small" />}
                    {!isAtMax && (
                      <KarmaChip
                        amount={karmaCost}
                        size="small"
                        color={queuedEntry ? "success" : canAfford ? "default" : "warning"}
                      />
                    )}
                    {queuedEntry && (
                      <RiCheckLine
                        size={14}
                        style={{ color: "var(--mui-palette-success-main)" }}
                      />
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
                    primary={AttributeLabels[attrInfo.attr]}
                    secondary={isAtMax ? "At maximum" : `${attrInfo.value} → ${attrInfo.value + 1}`}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Paper>
    </Stack>
  )
}
