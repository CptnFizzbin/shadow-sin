import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import LinearProgress from "@mui/material/LinearProgress"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine, RiCloseLine } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { selectCurrentKarma } from "#/components/character/karma/karmaSelectors.ts"
import { useKarmaStore } from "#/components/character/karma/useKarmaStore.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"
import type { ImprovementEntry } from "#/system/karma/improvements/improvementEntry.ts"
import {
  isAttrIncreaseEntry,
  isLearnComplexFormEntry,
  isLearnSpellEntry,
  isSkillGroupIncreaseEntry,
  isSkillIncreaseEntry,
  isSkillSpecializationEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { getImprovementCost } from "#/system/karma/improvements/improvementUtils.ts"

import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./useImprovementSelector.ts"

const getImprovementLabel = (entry: ImprovementEntry): string => {
  if (isAttrIncreaseEntry(entry)) {
    return `${AttributeLabels[entry.attr]} ${entry.baseRating} → ${entry.newRating}`
  }
  if (isSkillIncreaseEntry(entry)) {
    return `${entry.skill} ${entry.baseRating} → ${entry.newRating}`
  }
  if (isSkillGroupIncreaseEntry(entry)) {
    return `${entry.group} (Group) ${entry.baseRating} → ${entry.newRating}`
  }
  if (isSkillSpecializationEntry(entry)) {
    return `${entry.skill}: ${entry.specialization}`
  }
  if (isLearnSpellEntry(entry)) {
    return `Learn ${entry.spell.name}`
  }
  if (isLearnComplexFormEntry(entry)) {
    return `Learn ${entry.complexForm.name}`
  }
  return "Unknown improvement"
}

export const ImprovementQueueAccordion: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const karmaStore = useKarmaStore()
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useSelector(karmaStore, selectCurrentKarma)

  const remainingKarma = currentKarma - totalCost
  const isOverBudget = remainingKarma < 0
  const karmaUsedPercent = currentKarma > 0
    ? Math.min((totalCost / currentKarma) * 100, 100)
    : 0

  return (
    <Accordion
      defaultExpanded={false}
      disableGutters
      elevation={0}
      sx={{
        "border": "1px solid",
        "borderColor": isOverBudget ? "error.main" : "divider",
        "borderRadius": 1,
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<RiArrowDownSLine size={18} />} sx={{ minHeight: 48 }}>
        <Stack sx={{ flex: 1, gap: 0.5, pr: 1 }}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="subtitle2">
              {allImprovements.length === 0
                ? "Queue — nothing added yet"
                : `Queue — ${allImprovements.length} improvement${allImprovements.length !== 1 ? "s" : ""}`}
            </Typography>
            <Chip
              label={`${totalCost} / ${currentKarma}k`}
              size="small"
              color={isOverBudget ? "error" : totalCost > 0 ? "primary" : "default"}
            />
          </Stack>
          <LinearProgress
            variant="determinate"
            value={karmaUsedPercent}
            color={isOverBudget ? "error" : "primary"}
            sx={{ borderRadius: 1, height: 3 }}
          />
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        <Divider />
        {allImprovements.length === 0 && (
          <Typography variant="body2" color="text.disabled" sx={{ px: 2, py: 1.5, textAlign: "center" }}>
            Browse improvements below and tap to add them to the queue.
          </Typography>
        )}
        {allImprovements.length > 0 && (
          <List disablePadding>
            {allImprovements.map((entry, index) => (
              <ListItem
                key={entry.id}
                divider={index < allImprovements.length - 1}
                secondaryAction={(
                  <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                    <Chip
                      label={`${getImprovementCost(entry)}k`}
                      size="small"
                      color="primary"
                    />
                    <IconButton
                      size="small"
                      onClick={() => improvementStore.remove(entry.id)}
                      aria-label={`Remove ${getImprovementLabel(entry)}`}
                    >
                      <RiCloseLine size={16} />
                    </IconButton>
                  </Stack>
                )}
              >
                <ListItemText
                  primary={getImprovementLabel(entry)}
                  slotProps={{ primary: { variant: "body2" } }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
