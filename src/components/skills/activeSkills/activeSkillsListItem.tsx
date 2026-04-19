import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { useActiveSkillDicePool } from "#/components/skills/skillDicePools.ts"
import { SkillListItem } from "#/components/skills/skillListItem.tsx"
import { ViewSkillDialog } from "#/components/skills/viewSkillDialog.tsx"
import { AttributeKey, AttributeLabels } from "#/lib/system/attributeKey.ts"
import type { SkillKey } from "#/lib/system/skills/skillKey.ts"
import { skillList } from "#/lib/system/skills/skillList.ts"

export interface ActiveSkillsListItemProps {
  skillKey: SkillKey
  rating: number
}

const selectableAttributes = Object.values(AttributeKey).filter(
  (key) => key !== AttributeKey.essence,
)

export const ActiveSkillsListItem: FC<ActiveSkillsListItemProps> = ({ skillKey, rating }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const skillInfo = skillList[skillKey]
  const isDefaulted = rating === 0 && (skillInfo.defaultable ?? true)

  const [selectedAttr, setSelectedAttr] = useState<AttributeKey>(skillInfo.attr)

  const skillDicePool = useActiveSkillDicePool({ skillKey, attrOverride: selectedAttr })

  const specialization = useCharacterSheet((sheet) => {
    return sheet.skills
      .activeSkills
      .find((s) => s.name === skillKey)
      ?.specialization
  })

  const specializationDicePool = useActiveSkillDicePool({ skillKey, specialization, attrOverride: selectedAttr })

  const attributeSelector = (
    <FormControl size="small" fullWidth>
      <InputLabel>Attribute</InputLabel>
      <Select
        label="Attribute"
        value={selectedAttr}
        onChange={(event) => setSelectedAttr(event.target.value as AttributeKey)}
      >
        {selectableAttributes.map((attrKey) => (
          <MenuItem key={attrKey} value={attrKey}>
            {AttributeLabels[attrKey]} — {attrKey}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  return (
    <>
      <SkillListItem
        name={skillKey}
        rating={rating}
        specialization={specialization}
        attr={selectedAttr}
        isDefaulted={isDefaulted}
        onClick={() => setDialogOpen(true)}
      />

      <ViewSkillDialog
        name={skillKey}
        body={attributeSelector}
        dicePools={[
          skillDicePool,
          specialization ? specializationDicePool : false,
        ]}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  )
}
