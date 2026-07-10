import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiChat4Line, RiCheckLine, RiStarLine } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { selectCurrentKarma } from "#/components/character/karma/karmaSelectors.ts"
import { useKarmaStore } from "#/components/character/karma/useKarmaStore.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import {
  useLanguageSkillDialog,
} from "#/components/character/skills/knowledgeSkills/dialogs/languageSkillDialog.tsx"
import { getLanguageSkillCap } from "#/system/karma/improvements/improvementCaps.ts"
import type {
  LearnLanguageSkillEntry,
  SkillIncreaseEntry,
  SkillSpecializationEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  isLearnLanguageSkillEntry,
  isSkillIncreaseEntry,
  isSkillSpecializationEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import { getImprovementCost } from "#/system/karma/improvements/improvementUtils.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { ImprovementQueuedLearnRow } from "./improvementQueuedLearnRow.tsx"
import { useSpecializationPickerDialog } from "./specializationPickerDialog.tsx"
import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./useImprovementSelector.ts"

const LINGO_COST = 2

export const ImprovementLanguageSkillList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const karmaStore = useKarmaStore()
  const languageSkills = useCharacterSheet((sheet) => sheet.skills.languageSkills)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useSelector(karmaStore, selectCurrentKarma)
  const languageSkillDialog = useLanguageSkillDialog()
  const specializationDialog = useSpecializationPickerDialog()

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedSkillIncreases = allImprovements
    .filter(isSkillIncreaseEntry)
    .filter((entry) => entry.skillType === "LanguageSkill")
  const queuedSpecs = allImprovements
    .filter(isSkillSpecializationEntry)
    .filter((entry) => entry.skillType === "LanguageSkill")
  const queuedLearns = allImprovements.filter(isLearnLanguageSkillEntry)

  const handleToggleSpec = async (skillName: string, currentLingo?: string) => {
    const queuedEntry = queuedSpecs.find((entry) => entry.skill === skillName) ?? null
    if (queuedEntry) {
      improvementStore.remove(queuedEntry.id)
      return
    }
    const lingo = await specializationDialog.open({
      skillLabel: skillName,
      fieldLabel: "Lingo",
      initialValue: currentLingo,
    })
    if (!lingo) return
    const newEntry: Omit<SkillSpecializationEntry, "id"> = {
      type: ImprovementType.skillSpecialization,
      skillType: "LanguageSkill",
      skill: skillName as SkillKey,
      specialization: lingo,
    }
    improvementStore.add(newEntry)
  }

  const handleEditSpec = async (skillName: string, currentLingo: string) => {
    const queuedEntry = queuedSpecs.find((entry) => entry.skill === skillName) ?? null
    if (!queuedEntry) return
    const lingo = await specializationDialog.open({
      skillLabel: skillName,
      fieldLabel: "Lingo",
      initialValue: currentLingo,
    })
    if (!lingo) return
    const replacement: Omit<SkillSpecializationEntry, "id"> = {
      type: ImprovementType.skillSpecialization,
      skillType: "LanguageSkill",
      skill: skillName as SkillKey,
      specialization: lingo,
    }
    improvementStore.remove(queuedEntry.id)
    improvementStore.add(replacement)
  }

  const handleToggleImprove = (skillName: SkillKey, numericRating: number) => {
    const queuedEntry = queuedSkillIncreases.find((entry) => entry.skill === skillName) ?? null
    if (queuedEntry) {
      improvementStore.remove(queuedEntry.id)
    } else {
      const newEntry: Omit<SkillIncreaseEntry, "id"> = {
        type: ImprovementType.skillIncrease,
        skillType: "LanguageSkill",
        skill: skillName,
        baseRating: numericRating,
        newRating: numericRating + 1,
      }
      improvementStore.add(newEntry)
    }
  }

  const openLearnDialog = async () => {
    const saved = await languageSkillDialog.open()
    if (!saved) return
    if (saved.rating === "native") return // Native languages can't be learned via karma
    const newEntry: Omit<LearnLanguageSkillEntry, "id"> = {
      type: ImprovementType.learnLanguageSkill,
      skill: { name: saved.name, rating: saved.rating, lingo: saved.lingo },
    }
    improvementStore.add(newEntry)
  }

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Typography variant="overline" color="text.secondary">Languages</Typography>

      {(languageSkills.length > 0 || queuedLearns.length > 0) && (
        <Paper variant="outlined">
          <List disablePadding>
            {languageSkills.map((skill, index) => {
              const cap = getLanguageSkillCap()
              const isNative = skill.rating === "native"
              const numericRating: number = skill.rating === "native" ? cap : skill.rating
              const karmaCost = (numericRating + 1) * 1
              const isAtMax = isNative || numericRating >= cap
              const queuedEntry = queuedSkillIncreases.find((entry) => entry.skill === skill.name) ?? null
              const canAffordImprove = queuedEntry !== null || karmaCost <= remainingKarma
              const improveDisabled = isAtMax || (!canAffordImprove && !queuedEntry)
              const queuedSpec = queuedSpecs.find((entry) => entry.skill === skill.name) ?? null
              // Native languages can still get a lingo — it's just the karma cost that matters.
              const canAffordSpec = queuedSpec !== null || LINGO_COST <= remainingKarma
              const isLast = index === languageSkills.length - 1 && queuedLearns.length === 0

              return (
                <ListItem
                  key={skill.name}
                  disablePadding
                  divider={!isLast}
                  secondaryAction={(
                    <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                      {isAtMax
                        ? <Chip label={isNative ? "Native" : "Max"} size="small" />
                        : (
                            <Chip
                              label={`${karmaCost}k`}
                              size="small"
                              color={queuedEntry ? "success" : canAffordImprove ? "default" : "warning"}
                            />
                          )}
                      {queuedEntry && (
                        <RiCheckLine size={14} style={{ color: "var(--mui-palette-success-main)" }} />
                      )}
                      {queuedSpec && (
                        <Tooltip title="Edit lingo">
                          <Chip
                            label={queuedSpec.specialization}
                            size="small"
                            color="success"
                            variant="outlined"
                            onClick={() => handleEditSpec(skill.name, queuedSpec.specialization)}
                            sx={{ cursor: "pointer", maxWidth: 160 }}
                          />
                        </Tooltip>
                      )}
                      <Tooltip title={queuedSpec ? "Remove lingo" : `Lingo (${LINGO_COST}k)`}>
                        <span>
                          <IconButton
                            size="small"
                            aria-label={queuedSpec ? "Remove lingo" : "Add lingo"}
                            aria-pressed={queuedSpec !== null}
                            color={queuedSpec ? "success" : "default"}
                            disabled={!canAffordSpec && !queuedSpec}
                            onClick={() => handleToggleSpec(skill.name, skill.lingo)}
                          >
                            <RiStarLine size={16} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  )}
                >
                  <ListItemButton
                    aria-label="Improve rating"
                    aria-pressed={queuedEntry !== null}
                    disabled={improveDisabled}
                    onClick={() => handleToggleImprove(skill.name as SkillKey, numericRating)}
                    sx={{
                      minHeight: 52,
                      opacity: improveDisabled && !queuedEntry && !isAtMax ? 0.45 : 1,
                    }}
                  >
                    <ListItemText
                      primary={skill.name}
                      secondary={isNative
                        ? "Native"
                        : isAtMax
                          ? `Rating ${skill.rating}`
                          : `${skill.rating} → ${numericRating + 1}`}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
            {queuedLearns.map((entry, index) => (
              <ImprovementQueuedLearnRow
                key={entry.id}
                primary={entry.skill.name}
                secondary={`New language · Rating ${entry.skill.rating}`}
                cost={getImprovementCost(entry)}
                isLastRow={index === queuedLearns.length - 1}
                onRemove={() => improvementStore.remove(entry.id)}
              />
            ))}
          </List>
        </Paper>
      )}

      {languageSkills.length === 0 && queuedLearns.length === 0 && (
        <Stack sx={{ py: 2, alignItems: "center", gap: 0.5 }}>
          <RiChat4Line size={28} style={{ opacity: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            No language skills
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
        Learn New Language
      </Button>
    </Stack>
  )
}
