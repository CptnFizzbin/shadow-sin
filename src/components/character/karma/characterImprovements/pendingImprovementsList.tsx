import DeleteIcon from "@mui/icons-material/Delete"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import type { AttributeKey } from "#/system/attributeKey.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import {
  describeActiveSkillImprovement,
  describeAttributeImprovement,
  describeKnowledgeSkillImprovement,
  describeLanguageSkillImprovement,
  describeSkillGroupImprovement,
} from "./improvementDescription.ts"
import {
  calcActiveSkillKarmaCost,
  calcAttributeKarmaCost,
  calcSkillGroupKarmaCost,
  NEW_SPELL_KARMA_COST,
  SKILL_SPECIALIZATION_KARMA_COST,
} from "./improvementsKarmaCost.ts"
import type { ImprovementsState } from "./improvementsState.ts"
import type { ImprovementsStore } from "./improvementsStore.ts"

interface ImprovementItem {
  key: string
  label: string
  karmaCost: number
  onRemove: () => void
}

const buildImprovementItems = (state: ImprovementsState, store: ImprovementsStore): ImprovementItem[] => {
  const items: ImprovementItem[] = []

  for (const [attr, value] of Object.entries(state.attrImprovement)) {
    if (!value) continue
    const attributeKey = attr as AttributeKey
    items.push({
      key: `attr-${attr}`,
      label: describeAttributeImprovement(attributeKey, value.newRating),
      karmaCost: calcAttributeKarmaCost(value.newRating),
      onRemove: () => store.removeAttributeImprovement(attributeKey),
    })
  }

  for (const [skill, value] of Object.entries(state.activeSkillImprovement)) {
    if (!value) continue
    const skillKey = skill as SkillKey
    items.push({
      key: `skill-${skill}-${value.newSpecialization ?? value.newRating}`,
      label: describeActiveSkillImprovement(skillKey, value),
      karmaCost: value.newRating !== undefined
        ? calcActiveSkillKarmaCost(value.newRating)
        : SKILL_SPECIALIZATION_KARMA_COST,
      onRemove: () => store.removeActiveSkillImprovement(skillKey),
    })
  }

  for (const [group, value] of Object.entries(state.skillGroupImprovement)) {
    if (!value) continue
    const groupKey = group as SkillGroupKey
    items.push({
      key: `group-${group}`,
      label: describeSkillGroupImprovement(groupKey, value.newRating),
      karmaCost: value.newRating !== undefined ? calcSkillGroupKarmaCost(value.newRating) : 0,
      onRemove: () => store.removeSkillGroupImprovement(groupKey),
    })
  }

  for (const [skill, value] of Object.entries(state.knowledgeImprovement)) {
    if (!value) continue
    items.push({
      key: `knowledge-${skill}-${value.newSpecialization ?? value.newRating}`,
      label: describeKnowledgeSkillImprovement(skill, value),
      karmaCost: value.newRating !== undefined
        ? calcActiveSkillKarmaCost(value.newRating)
        : SKILL_SPECIALIZATION_KARMA_COST,
      onRemove: () => store.removeKnowledgeSkillImprovement(skill),
    })
  }

  for (const [skill, value] of Object.entries(state.languageImprovement)) {
    if (!value) continue
    items.push({
      key: `language-${skill}-${value.newSpecialization ?? value.newRating}`,
      label: describeLanguageSkillImprovement(skill, value),
      karmaCost: value.newRating !== undefined
        ? calcActiveSkillKarmaCost(value.newRating)
        : SKILL_SPECIALIZATION_KARMA_COST,
      onRemove: () => store.removeLanguageSkillImprovement(skill),
    })
  }

  for (const spell of Object.values(state.learnSpell)) {
    items.push({
      key: `spell-${spell.id}`,
      label: `${spell.name} (new spell)`,
      karmaCost: NEW_SPELL_KARMA_COST,
      onRemove: () => store.removeLearnSpell(spell.id),
    })
  }

  return items
}

interface PendingImprovementsListProps {
  improvementsStore: ImprovementsStore
}

export const PendingImprovementsList: FC<PendingImprovementsListProps> = ({
  improvementsStore,
}) => {
  const state = useSelector(improvementsStore.store, (s) => s)
  const items = buildImprovementItems(state, improvementsStore)

  if (items.length === 0) return null

  return (
    <>
      <Stack sx={{ gap: 0.5 }}>
        {items.map((item) => (
          <Stack
            key={item.key}
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography variant="body2">{item.label}</Typography>
            <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {item.karmaCost} karma
              </Typography>
              <IconButton size="small" color="error" onClick={item.onRemove}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Divider />
    </>
  )
}
