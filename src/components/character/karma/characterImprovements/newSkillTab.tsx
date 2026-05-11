import AddIcon from "@mui/icons-material/Add"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useMemo, useState } from "react"
import { createSelector } from "reselect"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import {
  selectActiveSkills,
  selectAllowedActiveSkills,
  selectSkillGroups,
  useCharacterSheetSelector,
} from "#/components/character/sheet/characterSheet.selectors.ts"
import { ActiveSkillSelectInput } from "#/components/character/skills/forms/activeSkillSelectInput.tsx"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { useSpendKarmaDialogContext } from "./forms/spendKarmaDialogContext.tsx"
import type { ImprovementsSelector } from "./improvements.selectors.ts"
import { useImprovementsSelector } from "./improvements.selectors.ts"

const selectQueuedSkillsSet: ImprovementsSelector<Set<SkillKey>> = (state) =>
  new Set(Object.keys(state.activeSkillImprovement) as SkillKey[])

export const NewSkillTab: FC = () => {
  const { improvementsStore } = useSpendKarmaDialogContext()
  const [selectedNewSkillKey, setSelectedNewSkillKey] = useState<SkillKey | "">("")

  const queuedNewSkills = useImprovementsSelector(selectQueuedSkillsSet)
  const allowedSkillsSelector = useMemo(() => createSelector([
    selectAllowedActiveSkills,
    selectActiveSkills,
    selectSkillGroups,
    () => queuedNewSkills,
  ], (allowed, active, groups, queued) => {
    const existing = new Set(active.map((skill) => skill.name))
    const covered = new Set(groups.flatMap((group) => getSkillsInGroup(group.name)))

    return new Set(Object.keys(allowed) as SkillKey[])
      .difference(queued)
      .difference(existing)
      .difference(covered)
  }), [queuedNewSkills])

  const allowedSkills = useCharacterSheetSelector(allowedSkillsSelector)

  const handleAdd = () => {
    if (!selectedNewSkillKey) return
    improvementsStore.improveActiveSkill(selectedNewSkillKey, 1)
    setSelectedNewSkillKey("")
  }

  if (allowedSkills.size === 0) {
    return (
      <Typography color="text.secondary">
        All skills are already known.
      </Typography>
    )
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Skill</InputLabel>
        <ActiveSkillSelectInput
          value={selectedNewSkillKey}
          label="Skill"
          onChange={(event) => setSelectedNewSkillKey(event.target.value as SkillKey | "")}
          filterOption={(key) => allowedSkills.has(key)}
        />
      </FormControl>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        disabled={!selectedNewSkillKey}
        onClick={handleAdd}
        fullWidth
      >
        Add Skill
      </Button>
    </Stack>
  )
}
