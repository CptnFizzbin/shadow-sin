import Stack from "@mui/material/Stack"
import type { FC } from "react"

import type { AttributeKey } from "#/system/attributeKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { SkillSelectListItem } from "./skillSelectListItem.tsx"

interface SkillSelectListProps {
  skills: SkillKey[]
  selectedSkill: SkillKey
  onSelectSkill: (skill: SkillKey) => void
  /** Overrides each row's natural attribute (e.g. a weapon's configured attribute). */
  attrOverride?: AttributeKey
  /** When false, an untrained skill hides its row instead of rendering it. Defaults to true. */
  includeDefaulting?: boolean
}

/**
 * A list of selectable skills, one row per skill. Each row (`SkillSelectListItem`) fetches its
 * own current rating instead of the caller computing every candidate's rating up front — so the
 * `skills` list can change freely without the caller needing a fixed-order block of selector
 * hooks to cover every possible candidate.
 */
export const SkillSelectList: FC<SkillSelectListProps> = ({
  skills,
  selectedSkill,
  onSelectSkill,
  attrOverride,
  includeDefaulting = true,
}) => (
  <Stack>
    {skills.map((skill) => (
      <SkillSelectListItem
        key={skill}
        skill={skill}
        isSelected={skill === selectedSkill}
        attrOverride={attrOverride}
        includeDefaulting={includeDefaulting}
        onSelect={() => onSelectSkill(skill)}
      />
    ))}
  </Stack>
)
