import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import { SkillListItem } from "#/components/runner/skills/skillListItem.tsx"
import { DicePoolsStack, useViewSkillDialog } from "#/components/runner/skills/viewSkillDialog.tsx"
import { useActiveSkillDicePool } from "#/hooks/runner/skills/skillDicePools.ts"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
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

const ActiveSkillDialogBody: FC<{ skillKey: SkillKey, specialization?: string }> = ({
  skillKey,
  specialization,
}) => {
  const skillInfo = skillList[skillKey]
  const [selectedAttr, setSelectedAttr] = useState<AttributeKey>(skillInfo.attr)

  const skillDicePool = useActiveSkillDicePool({ skillKey, attrOverride: selectedAttr })
  const specializationDicePool = useActiveSkillDicePool({ skillKey, specialization, attrOverride: selectedAttr })

  return (
    <Stack spacing={1}>
      <FormControl size="small" fullWidth>
        <InputLabel>Attribute</InputLabel>
        <Select
          label="Attribute"
          value={selectedAttr}
          onChange={(event) => setSelectedAttr(event.target.value)}
        >
          {selectableAttributes.map((attrKey) => (
            <MenuItem key={attrKey} value={attrKey}>
              {AttributeLabels[attrKey]} — {attrKey}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DicePoolsStack
        dicePools={[
          skillDicePool,
          specialization ? specializationDicePool : false,
        ]}
      />
    </Stack>
  )
}

export const ActiveSkillsListItem: FC<ActiveSkillsListItemProps> = ({ skillKey, rating }) => {
  const skillInfo = skillList[skillKey]
  const isDefaulted = rating === 0 && (skillInfo.defaultable ?? true)

  const specialization = useRunnerStoreSelector((sheet) => {
    return sheet.skills
      .activeSkills
      .find((s) => s.name === skillKey)
      ?.specialization
  })

  const viewSkillDialog = useViewSkillDialog()

  return (
    <>
      <SkillListItem
        name={skillKey}
        rating={rating}
        specialization={specialization}
        attr={skillInfo.attr}
        isDefaulted={isDefaulted}
        onClick={() => viewSkillDialog.open({
          name: skillKey,
          body: <ActiveSkillDialogBody skillKey={skillKey} specialization={specialization} />,
        })}
      />
      {viewSkillDialog.dialog}
    </>
  )
}
