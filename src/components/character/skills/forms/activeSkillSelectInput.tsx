import MenuItem from "@mui/material/MenuItem"
import type { BaseSelectProps } from "@mui/material/Select"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { sort } from "fast-sort"
import type { FC } from "react"

import {
  selectAllowedActiveSkills,
  useCharacterSheetSelector,
} from "#/components/character/sheet/characterSheet.selectors.ts"
import type { SkillInfo } from "#/system/skills/skillInfo.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

export interface ActiveSkillSelectInputProps extends Omit<BaseSelectProps<SkillKey>, "children"> {
  filterOption?: (key: SkillKey, info: SkillInfo) => boolean
}

export const ActiveSkillSelectInput: FC<ActiveSkillSelectInputProps> = ({
  filterOption = () => true,
  ...selectProps
}) => {
  const availableSkills = useCharacterSheetSelector(selectAllowedActiveSkills)
  const options = Object.entries(availableSkills)
    .filter(([key, info]) => filterOption(key as SkillKey, info))

  return (
    <Select {...selectProps}>
      {sort(options)
        .by([
          { asc: ([key]) => key },
        ]).map(([key, skill]) => (
          <MenuItem key={key} value={key}>
            <Stack direction="row" sx={{ justifyContent: "space-between", flexGrow: 1 }}>
              <Typography>{key}</Typography>
              {skill.group && <Typography sx={{ color: "text.secondary" }}>{skill.group}</Typography>}
            </Stack>
          </MenuItem>
        ),
        )}
    </Select>
  )
}
