import Chip from "@mui/material/Chip"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { RiSearchLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { useAttr } from "#/components/Character/character-utils.ts"
import { useWoundModifier } from "#/components/Damage/use-wound-modifier.ts"
import { SkillDicePoolDialog } from "#/components/Skills/skill-dice-pool-dialog.tsx"
import { AttributeLabels } from "#/lib/system/attribute-key.ts"
import type { SkillKey } from "#/lib/system/skill-key.ts"
import { Skills } from "#/lib/system/skill-key.ts"

interface SkillRowProps {
  skillKey: SkillKey
  onClick: () => void
}

const SkillRow: FC<SkillRowProps> = ({ skillKey, onClick }) => {
  const skillInfo = Skills[skillKey]

  const skillRating = useCharacterSheet(
    (sheet) => sheet.skills.activeSkills.find((s) => s.name === skillKey)?.rating ?? 0,
  )
  const groupRating = useCharacterSheet(
    (sheet) =>
      sheet.skills.skillGroups.find((s) => s.name === skillInfo.group)?.rating ?? 0,
  )
  const specialization = useCharacterSheet(
    (sheet) => sheet.skills.activeSkills.find((s) => s.name === skillKey)?.specialization,
  )

  const attrValue = useAttr(skillInfo.attr)
  const woundMod = useWoundModifier()

  const effectiveRating = Math.max(skillRating, groupRating)
  const isDefaulting = effectiveRating === 0 && skillInfo.defaultable !== false
  const defaultingPenalty = isDefaulting ? 1 : 0
  const totalDice = Math.max(0, effectiveRating + attrValue - defaultingPenalty - woundMod)

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      sx={{
        "p": 1,
        "borderRadius": 1,
        "cursor": "pointer",
        "border": "1px solid",
        "borderColor": "divider",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onClick}
    >
      <Stack flexGrow={1}>
        <Typography variant="body2">{skillKey}</Typography>
        {specialization && (
          <Typography variant="caption" color="text.secondary">
            {specialization}
          </Typography>
        )}
      </Stack>

      <Typography variant="caption" color="text.secondary">
        {AttributeLabels[skillInfo.attr]}
      </Typography>

      <Chip
        label={isDefaulting ? "–" : effectiveRating}
        size="small"
        variant="outlined"
        sx={{ minWidth: 32, fontSize: "0.75rem" }}
      />

      <Chip
        label={totalDice}
        size="small"
        color={isDefaulting ? "warning" : "secondary"}
        sx={{ minWidth: 32, fontSize: "0.75rem" }}
      />
    </Stack>
  )
}

export const SkillsActiveView: FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkillKey, setSelectedSkillKey] = useState<SkillKey | null>(null)

  const characterActiveSkillNames = useCharacterSheet(
    (sheet) => new Set(sheet.skills.activeSkills.map((s) => s.name)),
  )
  const characterSkillGroupNames = useCharacterSheet(
    (sheet) => new Set(sheet.skills.skillGroups.map((s) => s.name)),
  )

  const skillEntries = Object.entries(Skills) as Array<
    [SkillKey, (typeof Skills)[SkillKey]]
  >

  const visibleSkills = skillEntries.filter(([skillKey, skillInfo]) => {
    const hasIndividualRank = characterActiveSkillNames.has(skillKey)
    const hasCoveringGroup =
      skillInfo.group !== undefined && characterSkillGroupNames.has(skillInfo.group)

    const isVisible =
      hasIndividualRank
      || hasCoveringGroup
      || skillInfo.defaultable !== false

    if (!isVisible) return false

    if (!searchQuery) return true
    return skillKey.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <>
      <TextField
        size="small"
        placeholder="Search skills…"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <RiSearchLine size={16} />
              </InputAdornment>
            ),
          },
        }}
        fullWidth
      />

      <Stack gap={0.5}>
        {visibleSkills.map(([skillKey]) => (
          <SkillRow
            key={skillKey}
            skillKey={skillKey}
            onClick={() => setSelectedSkillKey(skillKey)}
          />
        ))}

        {visibleSkills.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 2 }}
          >
            No skills found
          </Typography>
        )}
      </Stack>

      <SkillDicePoolDialog
        skillKey={selectedSkillKey}
        onClose={() => setSelectedSkillKey(null)}
      />
    </>
  )
}
