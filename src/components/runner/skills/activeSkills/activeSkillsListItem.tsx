import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import type { FC } from "react"
import { useState } from "react"

import { useActiveSkillDicePool } from "#/components/runner/skills/skillDicePools.ts"
import { SkillListItem } from "#/components/runner/skills/skillListItem.tsx"
import { useViewSkillDialog } from "#/components/runner/skills/viewSkillDialog.tsx"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeKey, AttributeLabels } from "#/system/attributeKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

interface ActiveSkillsListItemProps {
  skillKey: SkillKey
  rating: number
}

const selectableAttributes = Object.values(AttributeKey).filter(
  (key) => key !== AttributeKey.essence,
)

export const ActiveSkillsListItem: FC<ActiveSkillsListItemProps> = ({ skillKey, rating }) => {
  const skillInfo = skillList[skillKey]
  const isDefaulted = rating === 0 && (skillInfo.defaultable ?? true)

  const [selectedAttr, setSelectedAttr] = useState<AttributeKey>(skillInfo.attr)

  const skillDicePool = useActiveSkillDicePool({ skillKey, attrOverride: selectedAttr })

  const specialization = useRunnerStoreSelector((sheet) => {
    return sheet.skills
      .activeSkills
      .find((s) => s.name === skillKey)
      ?.specialization
  })

  const specializationDicePool = useActiveSkillDicePool({ skillKey, specialization, attrOverride: selectedAttr })

  const viewSkillDialog = useViewSkillDialog()

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
        onClick={() => viewSkillDialog.open({
          name: skillKey,
          body: attributeSelector,
          dicePools: [
            skillDicePool,
            specialization ? specializationDicePool : false,
          ],
        })}
      />
      {viewSkillDialog.dialog}
    </>
  )
}
