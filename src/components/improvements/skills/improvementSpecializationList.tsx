import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import List from "@mui/material/List"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import { ImprovementsConfig } from "#/components/improvements/improvementsConfig.ts"
import { useSpendKarmaDialogContext } from "#/lib/contexts/improvements/spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "#/lib/hooks/improvements/useImprovementSelector.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerSelector.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { SkillSpecializationEntry } from "#/system/karma/improvements/improvementEntry.ts"
import { isSkillSpecializationEntry } from "#/system/karma/improvements/improvementEntry.ts"
import {
  selectAllImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import { ImprovementSpecializationRow } from "./improvementSpecializationRow.tsx"
import { useSpecializationPickerDialog } from "./specializationPickerDialog.tsx"

type SkillType = SkillSpecializationEntry["skillType"]

function getActiveSkillSpecOptions(skill: SkillKey) {
  const specs = skillList[skill]?.specializations ?? []
  return {
    fixedOptions: specs.filter((s): s is string => typeof s === "string"),
    customPlaceholders: specs
      .filter((s): s is { custom: true, placeholder: string } => typeof s === "object" && s !== null)
      .map((s) => s.placeholder),
  }
}

interface SpecializableRow {
  name: string
  isGrouped?: boolean
  currentValue?: string
}

/**
 * Specialization hub section. Lists every Active, Knowledge, and Language skill already on the
 * runner sheet — skills queued to be *learned* this downtime aren't specializable yet (SR4A),
 * and since they don't exist on `sheet.skills.*` until Save, they're naturally excluded just by
 * reading off the sheet instead of the improvement queue.
 */
export const ImprovementSpecializationList: FC = () => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const activeSkills = useRunnerSelector(({ skills }) => skills.activeSkills)
  const skillGroups = useRunnerSelector(({ skills }) => skills.skillGroups)
  const knowledgeSkills = useRunnerSelector(({ skills }) => skills.knowledgeSkills)
  const languageSkills = useRunnerSelector(({ skills }) => skills.languageSkills)
  const allImprovements = useImprovementSelector(selectAllImprovements)
  const totalQueuedCost = useImprovementSelector(selectImprovementsTotalCost)
  const currentKarma = useRunnerStoreSelector(Selectors.karma.selectCurrentKarma)
  const specializationDialog = useSpecializationPickerDialog()

  const remainingKarma = currentKarma - totalQueuedCost
  const queuedSpecs = allImprovements.filter(isSkillSpecializationEntry)
  const specCost = ImprovementsConfig.skills.active.karmaCost.specialization

  const findQueued = (skillType: SkillType, skill: string) =>
    queuedSpecs.find((entry) => entry.skillType === skillType && entry.skill === skill) ?? null

  const openPicker = async (
    skillType: SkillType,
    skill: string,
    fieldLabel: string,
    initialValue: string | undefined,
    options: { fixedOptions?: string[], customPlaceholders?: string[] } = {},
  ) => {
    const value = await specializationDialog.open({
      skillLabel: skill,
      fieldLabel,
      initialValue,
      ...options,
    })
    if (!value) return
    const queuedEntry = findQueued(skillType, skill)
    const newEntry: Omit<SkillSpecializationEntry, "id"> = {
      type: ImprovementType.skillSpecialization,
      skillType,
      skill: skill as SkillKey,
      specialization: value,
    }
    if (queuedEntry) improvementStore.remove(queuedEntry.id)
    improvementStore.add(newEntry)
  }

  const activeSkillRows: SpecializableRow[] = [
    ...activeSkills.map((skill) => ({ name: skill.name, currentValue: skill.specialization })),
    ...skillGroups.flatMap((group) => getSkillsInGroup(group.name).map((skillKey) => ({
      name: skillKey,
      isGrouped: true,
    }))),
  ]

  const isGroupedActiveSkill = activeSkillRows.some((row) => row.isGrouped)

  return (
    <Stack sx={{ gap: 1.5 }}>
      {isGroupedActiveSkill && (
        <Alert severity="info" sx={{ py: 0.25 }}>
          <Typography variant="caption">
            Skills marked ⚠ belong to groups — specializing them individually will break the group.
          </Typography>
        </Alert>
      )}

      <Typography variant="overline" color="text.secondary">Active Skills</Typography>
      {activeSkillRows.length === 0
        ? (
            <Typography variant="body2" color="text.secondary">
              No active skills to specialize.
            </Typography>
          )
        : (
            <Paper variant="outlined">
              <List disablePadding>
                {activeSkillRows.map((row, index) => {
                  const queuedEntry = findQueued("ActiveSkill", row.name)
                  const canAfford = queuedEntry !== null || specCost <= remainingKarma
                  const primary = (
                    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                      {row.name}
                      {row.isGrouped && (
                        <Tooltip title="Belongs to a skill group — specializing will break the group">
                          <Box component="span" sx={{ color: "warning.main", fontSize: "0.85em" }}>⚠</Box>
                        </Tooltip>
                      )}
                    </Box>
                  )
                  return (
                    <ImprovementSpecializationRow
                      key={row.name}
                      primary={primary}
                      fieldLabel="Specialization"
                      isLastRow={index === activeSkillRows.length - 1}
                      isQueued={queuedEntry !== null}
                      queuedName={queuedEntry?.specialization}
                      canAfford={canAfford}
                      cost={specCost}
                      onToggle={() => {
                        if (queuedEntry) {
                          improvementStore.remove(queuedEntry.id)
                          return
                        }
                        void openPicker(
                          "ActiveSkill",
                          row.name,
                          "Specialization",
                          row.currentValue,
                          getActiveSkillSpecOptions(row.name as SkillKey),
                        )
                      }}
                      onEdit={() => void openPicker(
                        "ActiveSkill",
                        row.name,
                        "Specialization",
                        queuedEntry?.specialization,
                        getActiveSkillSpecOptions(row.name as SkillKey),
                      )}
                    />
                  )
                })}
              </List>
            </Paper>
          )}

      <Typography variant="overline" color="text.secondary">Knowledge Skills</Typography>
      {knowledgeSkills.length === 0
        ? (
            <Typography variant="body2" color="text.secondary">
              No knowledge skills to specialize.
            </Typography>
          )
        : (
            <Paper variant="outlined">
              <List disablePadding>
                {knowledgeSkills.map((skill, index) => {
                  const queuedEntry = findQueued("KnowledgeSkill", skill.name)
                  const canAfford = queuedEntry !== null || specCost <= remainingKarma
                  return (
                    <ImprovementSpecializationRow
                      key={skill.name}
                      primary={skill.name}
                      fieldLabel="Specialization"
                      isLastRow={index === knowledgeSkills.length - 1}
                      isQueued={queuedEntry !== null}
                      queuedName={queuedEntry?.specialization}
                      canAfford={canAfford}
                      cost={specCost}
                      onToggle={() => {
                        if (queuedEntry) {
                          improvementStore.remove(queuedEntry.id)
                          return
                        }
                        void openPicker("KnowledgeSkill", skill.name, "Specialization", skill.specialization)
                      }}
                      onEdit={() => void openPicker(
                        "KnowledgeSkill",
                        skill.name,
                        "Specialization",
                        queuedEntry?.specialization,
                      )}
                    />
                  )
                })}
              </List>
            </Paper>
          )}

      <Typography variant="overline" color="text.secondary">Languages</Typography>
      {languageSkills.length === 0
        ? (
            <Typography variant="body2" color="text.secondary">
              No language skills to specialize.
            </Typography>
          )
        : (
            <Paper variant="outlined">
              <List disablePadding>
                {languageSkills.map((skill, index) => {
                  const queuedEntry = findQueued("LanguageSkill", skill.name)
                  const canAfford = queuedEntry !== null || specCost <= remainingKarma
                  return (
                    <ImprovementSpecializationRow
                      key={skill.name}
                      primary={skill.name}
                      fieldLabel="Lingo"
                      isLastRow={index === languageSkills.length - 1}
                      isQueued={queuedEntry !== null}
                      queuedName={queuedEntry?.specialization}
                      canAfford={canAfford}
                      cost={specCost}
                      onToggle={() => {
                        if (queuedEntry) {
                          improvementStore.remove(queuedEntry.id)
                          return
                        }
                        void openPicker("LanguageSkill", skill.name, "Lingo", skill.lingo)
                      }}
                      onEdit={() => void openPicker(
                        "LanguageSkill",
                        skill.name,
                        "Lingo",
                        queuedEntry?.specialization,
                      )}
                    />
                  )
                })}
              </List>
            </Paper>
          )}

      {specializationDialog.dialog}
    </Stack>
  )
}
