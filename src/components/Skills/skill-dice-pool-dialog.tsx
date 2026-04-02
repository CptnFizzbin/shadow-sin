import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { useAttr } from "#/components/Character/character-utils.ts"
import { DicePool } from "#/components/DicePool/dice-pool.tsx"
import { useWoundDiceGroup } from "#/components/DicePool/use-dice-group.ts"
import { AttributeLabels } from "#/lib/system/attribute-key.ts"
import type { SkillKey } from "#/lib/system/skill-key.ts"
import { Skills } from "#/lib/system/skill-key.ts"

interface SkillDialogContentProps {
  skillKey: SkillKey
}

const SkillDialogContent: FC<SkillDialogContentProps> = ({ skillKey }) => {
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
  const woundGroup = useWoundDiceGroup()

  const effectiveRating = Math.max(skillRating, groupRating)
  const isDefaulting = effectiveRating === 0 && skillInfo.defaultable !== false
  const attrLabel = AttributeLabels[skillInfo.attr]

  const baseGroups = [
    effectiveRating > 0 && { name: skillKey, size: effectiveRating },
    { name: attrLabel, size: attrValue },
    isDefaulting && { name: "Default", size: -1, color: "warning.main" as const },
    woundGroup,
  ] as const

  return (
    <Stack gap={2}>
      <DicePool name={skillKey} groups={[...baseGroups]} />

      {specialization && (
        <Stack gap={0.5}>
          <Typography variant="caption" color="text.secondary">
            Specialization: {specialization}
          </Typography>
          <DicePool
            name={`${skillKey} (${specialization})`}
            groups={[...baseGroups, { name: "Specialization", size: 2 }]}
          />
        </Stack>
      )}
    </Stack>
  )
}

interface SkillDicePoolDialogProps {
  skillKey: SkillKey | null
  onClose: () => void
}

export const SkillDicePoolDialog: FC<SkillDicePoolDialogProps> = ({
  skillKey,
  onClose,
}) => {
  return (
    <Dialog open={skillKey !== null} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{skillKey ?? ""}</DialogTitle>
      <DialogContent>
        {skillKey !== null && <SkillDialogContent skillKey={skillKey} />}
      </DialogContent>
    </Dialog>
  )
}
