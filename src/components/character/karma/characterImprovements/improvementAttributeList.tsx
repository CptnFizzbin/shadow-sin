import Chip from "@mui/material/Chip"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiCheckLine } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { useActiveAttributes } from "#/components/character/attributes/hooks/useActiveAttributes.ts"
import { selectCurrentKarma } from "#/components/character/karma/karmaSelectors.ts"
import { useKarmaStore } from "#/components/character/karma/useKarmaStore.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { AttributeLabels } from "#/system/attributeKey.ts"
import { getAttributeCap } from "#/system/karma/improvements/improvementCaps.ts"
import type { AttrIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import { isAttrIncreaseEntry } from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"

import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./useImprovementSelector.ts"

// onBack kept for interface compatibility during dialog migration; not rendered
interface ImprovementAttributeListProps {
  onBack?: () => void
}

export const ImprovementAttributeList: FC<ImprovementAttributeListProps> = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const karmaStore = useKarmaStore()
  const sheet = useCharacterSheet((s) => s)
  const activeAttributes = useActiveAttributes()
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useSelector(karmaStore, selectCurrentKarma)

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedAttrIncreases = allImprovements.filter(isAttrIncreaseEntry)

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Typography variant="overline" color="text.secondary">Attributes</Typography>

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
                      <Chip
                        label={`${karmaCost}k`}
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
