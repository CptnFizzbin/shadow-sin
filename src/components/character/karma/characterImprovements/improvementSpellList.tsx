import Button from "@mui/material/Button"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiSparklingLine } from "@remixicon/react"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { useSpellFormDialog } from "#/components/character/spells/dialogs/spellFormDialog.tsx"
import type { LearnSpellEntry } from "#/system/karma/improvements/improvementEntry.ts"
import {
  isLearnSpellEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import { selectAllImprovements } from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import { getImprovementCost } from "#/system/karma/improvements/improvementUtils.ts"

import { ImprovementQueuedLearnRow } from "./improvementQueuedLearnRow.tsx"
import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./useImprovementSelector.ts"

export const ImprovementSpellList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const knownSpells = useCharacterSheet((sheet) => sheet.spells)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const spellFormDialog = useSpellFormDialog()

  const queuedLearns = allImprovements.filter(isLearnSpellEntry)

  const openLearnDialog = async () => {
    const saved = await spellFormDialog.open()
    if (!saved) return
    const newEntry: Omit<LearnSpellEntry, "id"> = {
      type: ImprovementType.learnSpell,
      spell: saved,
    }
    improvementStore.add(newEntry)
  }

  const hasContent = knownSpells.length > 0 || queuedLearns.length > 0

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Typography variant="overline" color="text.secondary">Spells</Typography>

      {hasContent && (
        <Paper variant="outlined">
          <List disablePadding>
            {knownSpells.map((spell, index) => {
              const isLast = index === knownSpells.length - 1 && queuedLearns.length === 0
              return (
                <ListItem
                  key={spell.id}
                  disablePadding
                  divider={!isLast}
                  sx={{ minHeight: 52, px: 2 }}
                >
                  <ListItemText
                    primary={spell.name}
                    secondary={`${spell.category} · ${spell.type}`}
                  />
                </ListItem>
              )
            })}
            {queuedLearns.map((entry, index) => (
              <ImprovementQueuedLearnRow
                key={entry.id}
                primary={entry.spell.name}
                secondary={`New spell · ${entry.spell.category}`}
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
          <RiSparklingLine size={28} style={{ opacity: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            No spells known
          </Typography>
        </Stack>
      )}

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={openLearnDialog}
        sx={{ alignSelf: "flex-start" }}
      >
        Learn New Spell
      </Button>

      {spellFormDialog.dialog}
    </Stack>
  )
}
